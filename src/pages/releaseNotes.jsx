import axios from 'axios';
import { useEffect, useState, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  CHANGELOG_PATH,
  VERSION_REGEX,
  VERSION_SECTION_REGEX,
  VERSION_VALIDATION_REGEX,
  CATEGORY_CONFIG,
  DEFAULT_CATEGORY,
  BADGE_STYLES,
} from '@constants/releaseNotesConstants';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

import packageJson from '../../package.json';

// Error message for failed loads
const ERROR_MESSAGE =
  '# Error Loading Release Notes\n\n' +
  'Unable to load the release notes content. Please try refreshing the page.\n\n' +
  'If the problem persists, please [open an issue on GitHub](https://github.com/vikingnope/worther/issues/new?template=bug_report.yml&title=%5BBUG%5D%20Release%20Notes%20is%20not%20loading&description=Release%20Notes%20page%20failed%20to%20load%20file).';

/**
 * Validate version string format
 */
const isValidVersion = version => VERSION_VALIDATION_REGEX.test(version);

/**
 * Extract versions from markdown content
 */
const extractVersions = markdown => {
  if (!markdown || typeof markdown !== 'string') return [];

  const versionMatches = markdown.match(VERSION_REGEX) || [];
  return versionMatches
    .map(match => {
      const result = match.match(/## (\d+\.\d+\.\d+) \(([^)]+)\)/);
      if (result && isValidVersion(result[1])) {
        return { version: result[1], type: result[2] };
      }
      return null;
    })
    .filter(Boolean);
};

/**
 * Get badge styling based on release type
 */
const getTypeBadge = type => BADGE_STYLES[type] || BADGE_STYLES.Minor;

/**
 * Get category configuration
 */
const getCategoryConfig = text => CATEGORY_CONFIG[text] || DEFAULT_CATEGORY;

/**
 * Shared markdown components
 */
const baseMarkdownComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className="border-b border-gray-700 pb-3 text-3xl leading-relaxed font-bold text-blue-400"
      {...props}
    >
      {children || 'Heading'}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-6 mb-4 text-2xl leading-relaxed font-bold text-blue-300" {...props}>
      {children || 'Heading'}
    </h2>
  ),
  h3: ({ children, ...props }) => {
    const { class: categoryClass, emoji: iconEmoji } = getCategoryConfig(
      children?.toString() || ''
    );
    return (
      <h3 className={`mt-5 mb-3 text-xl font-semibold ${categoryClass}`} {...props}>
        {iconEmoji}
        {children || 'Heading'}
      </h3>
    );
  },
  p: props => <p className="my-3 leading-relaxed text-gray-200" {...props} />,
  ul: props => <ul className="my-3 list-disc space-y-2 pl-6" {...props} />,
  li: props => <li className="pb-1 text-gray-300" {...props} />,
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-blue-400 underline hover:text-blue-300"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children || href || 'Link'}
    </a>
  ),
  code: props => (
    <code className="rounded bg-gray-800 px-1 py-0.5 text-sm text-cyan-300" {...props} />
  ),
  blockquote: props => (
    <blockquote className="my-3 border-l-4 border-gray-600 pl-4 text-gray-400 italic" {...props} />
  ),
  strong: props => <strong className="font-bold text-white" {...props} />,
  hr: props => <hr className="mt-10 mb-5 opacity-30" {...props} />,
};

// Version components skip h2 since it's manually rendered
const versionMarkdownComponents = {
  ...baseMarkdownComponents,
  h2: () => null,
};

/**
 * Version button component
 */
const VersionButton = ({ version, type, isActive, onClick }) => (
  <button
    data-version={version}
    onClick={onClick}
    className={`flex items-center rounded-lg px-3 py-1.5 whitespace-nowrap transition-all duration-300 ${
      isActive
        ? 'border-b-2 border-cyan-400 bg-gradient-to-r from-cyan-900/40 to-cyan-800/20'
        : 'hover:bg-gray-800/40'
    }`}
  >
    <span className={`text-sm font-medium ${isActive ? 'text-cyan-300' : 'text-gray-300'}`}>
      {version}
    </span>
    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${getTypeBadge(type)}`}>
      {type}
    </span>
  </button>
);

/**
 * Sidebar version button component
 */
const SidebarVersionButton = ({ version, type, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2 text-left transition-all duration-300 ${
        isActive
          ? 'border-l-2 border-cyan-400 bg-gradient-to-r from-cyan-900/40 to-cyan-800/20 pl-2.5'
          : 'hover:translate-x-0.5 hover:bg-gray-800/40'
      }`}
    >
      <div className="flex items-center">
        <span className={`text-base font-medium ${isActive ? 'text-cyan-300' : 'text-gray-300'}`}>
          {version}
        </span>
        <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${getTypeBadge(type)}`}>
          {type}
        </span>
      </div>
    </button>
  </li>
);

/**
 * Version section component
 */
const VersionSection = ({ version, type, section, isActive, onRef }) => {
  const versionId = `version-${version}`;

  return (
    <div key={versionId} id={versionId} ref={onRef} data-version={version} className="py-2">
      <div className="mt-2 mb-4 flex flex-wrap items-center gap-3">
        <h2
          className={`text-2xl leading-relaxed font-bold transition-colors duration-500 ${
            isActive ? 'text-cyan-300' : 'text-blue-300'
          }`}
        >
          {version}
        </h2>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getTypeBadge(type)}`}>
          {type}
        </span>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={versionMarkdownComponents}>
        {section}
      </ReactMarkdown>
    </div>
  );
};

export default function ReleaseNotes() {
  const [markdown, setMarkdown] = useState('');
  const [activeVersion, setActiveVersion] = useState(null);
  const contentRef = useRef(null);
  const versionRefs = useRef({});
  const horizontalScrollRef = useRef(null);

  // Extract versions from markdown
  const versions = useMemo(() => extractVersions(markdown), [markdown]);

  // Load release notes
  useEffect(() => {
    document.title = 'Worther - Release Notes';

    const AbortControllerClass = typeof window !== 'undefined' && window.AbortController;
    const controller = AbortControllerClass ? new AbortControllerClass() : null;

    axios
      .get(CHANGELOG_PATH, { signal: controller?.signal })
      .then(response => {
        if (typeof response.data === 'string' && !response.data.includes('<!doctype html>')) {
          setMarkdown(response.data);
        } else {
          setMarkdown(ERROR_MESSAGE);
        }
      })
      .catch(error => {
        if (error.name !== 'CanceledError') {
          console.error('Error loading release notes:', error);
          setMarkdown(ERROR_MESSAGE);
        }
      });

    return () => controller?.abort();
  }, []);

  // Set initial active version
  useEffect(() => {
    if (versions.length > 0 && !activeVersion) {
      setActiveVersion(versions[0].version);
    }
  }, [versions, activeVersion]);

  // Scroll to version
  const scrollToVersion = version => {
    if (!isValidVersion(version)) return;

    const element = versionRefs.current[version];
    if (element && contentRef.current) {
      setActiveVersion(version);

      const containerRect = contentRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + contentRef.current.scrollTop;

      contentRef.current.scrollTo({
        top: relativeTop - 20,
        behavior: 'smooth',
      });
    }
  };

  // Sync horizontal scroll when active version changes
  useEffect(() => {
    if (!activeVersion || !horizontalScrollRef.current) return;

    const escapedVersion = activeVersion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const button = horizontalScrollRef.current.querySelector(
      `button[data-version="${escapedVersion}"]`
    );

    if (!button) return;

    const timeoutId = setTimeout(() => {
      if (!horizontalScrollRef.current) return;

      const scrollbarWidth = horizontalScrollRef.current.clientWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const scrollPosition = Math.max(0, buttonLeft - scrollbarWidth / 2 + buttonWidth / 2);

      horizontalScrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeVersion]);

  // Track visible version with IntersectionObserver
  useEffect(() => {
    if (!contentRef.current || versions.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          const version = visibleEntry.target.dataset.version;
          if (version && isValidVersion(version)) {
            setActiveVersion(version);
          }
        }
      },
      {
        root: contentRef.current,
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1,
      }
    );

    Object.values(versionRefs.current).forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, [versions]);

  // Render release notes sections
  const renderSections = () => {
    return markdown.split(VERSION_SECTION_REGEX).map((section, index) => {
      // Intro section
      if (index === 0 && !section.match(/^## \d+\.\d+\.\d+ \([^)]+\)/)) {
        return (
          <ReactMarkdown
            key="intro"
            remarkPlugins={[remarkGfm]}
            components={baseMarkdownComponents}
          >
            {section}
          </ReactMarkdown>
        );
      }

      // Version section
      const match = section.match(/^## (\d+\.\d+\.\d+) \(([^)]+)\)/);
      if (!match || !isValidVersion(match[1])) return null;

      return (
        <VersionSection
          key={match[1]}
          version={match[1]}
          type={match[2]}
          section={section}
          isActive={activeVersion === match[1]}
          onRef={el => {
            if (el) versionRefs.current[match[1]] = el;
          }}
        />
      );
    });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <main className="flex-grow px-4 py-8 md:px-12">
        <h1 className="mb-6 text-center text-4xl leading-relaxed font-bold text-cyan-400 md:text-5xl">
          Release Notes
        </h1>
        <p className="mb-6 text-center text-blue-300">
          Current Version: <span className="font-semibold">{packageJson.version}</span>
        </p>

        {/* Horizontal version selector */}
        <div className="mb-6 flex overflow-x-auto px-1 py-2 xl:hidden" ref={horizontalScrollRef}>
          <div className="flex space-x-2">
            {versions.map(({ version, type }) => (
              <VersionButton
                key={version}
                version={version}
                type={type}
                isActive={activeVersion === version}
                onClick={() => scrollToVersion(version)}
              />
            ))}
          </div>
        </div>

        <div className="flex xl:gap-0">
          <div className="mx-auto max-w-4xl flex-1">
            <div className="release-notes-body relative rounded-xl border border-gray-800 bg-black/30 p-6">
              {/* Sidebar */}
              <div className="absolute top-0 -left-[210px] hidden w-[200px] xl:block">
                <div className="sticky top-6 rounded-xl border border-gray-800 bg-black/30 p-4">
                  <h2 className="mb-3 text-lg font-bold text-cyan-400">Version History</h2>
                  <div className="release-notes-sidebar max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    <ul className="space-y-1.5">
                      {versions.map(({ version, type }) => (
                        <SidebarVersionButton
                          key={version}
                          version={version}
                          type={type}
                          isActive={activeVersion === version}
                          onClick={() => scrollToVersion(version)}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                ref={contentRef}
                className="release-notes-scroll max-h-[calc(100vh-300px)] overflow-y-auto scroll-smooth pr-2 pb-4"
                aria-label="Release notes content"
              >
                <div>{renderSections()}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
