import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import packageJson from '../../package.json';
import { Footer } from '../components/utils/footer';
import { Header } from '../components/utils/header';

export default function Changelog() {
  const [markdown, setMarkdown] = useState('');
  const [activeVersion, setActiveVersion] = useState(null);
  const [versions, setVersions] = useState([]);
  const changelogContentRef = useRef(null);
  const versionElementsRef = useRef({});
  const horizontalScrollRef = useRef(null); // Add ref for horizontal version bar
  const observerRef = useRef(null);
  const lastManualScrollRef = useRef(0);
  const activeVersionTimeoutRef = useRef(null);
  const lastSetVersionRef = useRef(null);

  // Fetch the CHANGELOG.md file content from public directory
  useEffect(() => {
    fetch('/CHANGELOG.md')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load changelog: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        setMarkdown(text);
      })
      .catch(error => {
        console.error('Error loading changelog:', error);
        setMarkdown(
          '# Error Loading Changelog\n\nUnable to load the changelog content. Please try again later.'
        );
      });
  }, []);

  // Parse versions from markdown on component mount
  useEffect(() => {
    if (!markdown) return;

    // Extract version strings and their types from headings like "## 1.1.0 (Major)"
    const versionMatches = markdown.match(/## (\d+\.\d+\.\d+) \(([^)]+)\)/g) || [];

    // Extract both version numbers and release types
    const extractedVersions = versionMatches
      .map(match => {
        const fullMatch = match.match(/## (\d+\.\d+\.\d+) \(([^)]+)\)/);
        if (fullMatch) {
          return {
            version: fullMatch[1],
            type: fullMatch[2],
          };
        }
        return null;
      })
      .filter(Boolean);

    setVersions(extractedVersions);

    // Set initial active version
    if (extractedVersions.length > 0 && !activeVersion) {
      setActiveVersion(extractedVersions[0].version);
      lastSetVersionRef.current = extractedVersions[0].version;
    }
  }, [markdown, activeVersion]);

  // Debounced version setter to prevent rapid changes
  const debouncedSetActiveVersion = useCallback(version => {
    // Skip if it's the same version we just set
    if (version === lastSetVersionRef.current) return;

    // Clear any existing timeout
    if (activeVersionTimeoutRef.current) {
      clearTimeout(activeVersionTimeoutRef.current);
    }

    // Set a timeout to update the version after a delay
    activeVersionTimeoutRef.current = setTimeout(() => {
      setActiveVersion(version);
      lastSetVersionRef.current = version;
    }, 100); // 100ms debounce delay
  }, []);

  // Setup IntersectionObserver to track visible versions
  useEffect(() => {
    if (!changelogContentRef.current || versions.length === 0) return;

    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: changelogContentRef.current,
      // Focus on a narrow band at the top of the viewport
      rootMargin: '0px 0px -85% 0px',
      threshold: 0.1,
    };

    // Create new observer
    observerRef.current = new IntersectionObserver(entries => {
      // Skip if a manual scroll was recently performed
      if (Date.now() - lastManualScrollRef.current < 500) return;

      // Filter entries that are intersecting (visible)
      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Get the first version element that enters the top area of the viewport
        const topVersion = visibleEntries[0].target.dataset.version;
        if (topVersion && topVersion !== activeVersion) {
          debouncedSetActiveVersion(topVersion);
        }
      }
    }, options);

    // Observe all version elements
    Object.entries(versionElementsRef.current).forEach(([_version, element]) => {
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (activeVersionTimeoutRef.current) {
        clearTimeout(activeVersionTimeoutRef.current);
      }
    };
  }, [versions, debouncedSetActiveVersion, activeVersion]);

  // Function to scroll to a specific version
  const scrollToVersion = useCallback(version => {
    const element = versionElementsRef.current[version];
    if (element && changelogContentRef.current) {
      // Set active version immediately for better UX
      setActiveVersion(version);
      lastSetVersionRef.current = version;
      lastManualScrollRef.current = Date.now();

      // Calculate position (accounting for scroll container's offset)
      const containerRect = changelogContentRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop =
        elementRect.top - containerRect.top + changelogContentRef.current.scrollTop;

      // Add a small offset to position the heading better in the viewport
      const scrollOffset = 20;

      // Scroll to the element with smooth behavior
      changelogContentRef.current.scrollTo({
        top: relativeTop - scrollOffset,
        behavior: 'smooth',
      });
    }
  }, []);

  // Get badge based on release type
  const getTypeBadge = type => {
    return type === 'Major'
      ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50'
      : 'bg-blue-900/30 text-blue-300 border border-blue-800/50';
  };

  // Memoize the horizontal version buttons
  const horizontalVersionButtons = useMemo(() => {
    return versions.map(({ version, type }) => (
      <button
        key={version}
        data-version={version}
        onClick={() => scrollToVersion(version)}
        className={`flex items-center px-3 py-1.5 rounded-lg transition-all will-change-transform duration-400 ease-in-out whitespace-nowrap ${
          activeVersion === version
            ? 'bg-gradient-to-r from-cyan-900/40 to-cyan-800/20 border-b-2 border-cyan-400 shadow-sm shadow-cyan-900/10 scale-[1.02]'
            : 'hover:bg-gray-800/40 hover:scale-[1.01]'
        }`}
      >
        <span
          className={`text-sm font-medium transition-colors duration-400 ease-in-out ${
            activeVersion === version ? 'text-cyan-300' : 'text-gray-300'
          }`}
        >
          {version}
        </span>
        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${getTypeBadge(type)}`}>
          {type}
        </span>
      </button>
    ));
  }, [versions, activeVersion, scrollToVersion]);

  // Memoize the sidebar version buttons
  const sidebarVersionButtons = useMemo(() => {
    return versions.map(({ version, type }) => (
      <li key={version}>
        <button
          onClick={() => scrollToVersion(version)}
          className={`text-left w-full py-2 px-3 rounded-lg transition-all will-change-transform duration-500 ease-in-out ${
            activeVersion === version
              ? 'bg-gradient-to-r from-cyan-900/40 to-cyan-800/20 border-l-2 border-cyan-400 pl-2.5 shadow-sm shadow-cyan-900/10 scale-[1.01]'
              : 'hover:bg-gray-800/40 hover:translate-x-0.5'
          }`}
        >
          <div className="flex items-center">
            <span
              className={`text-base font-medium transition-colors duration-400 ease-in-out ${
                activeVersion === version ? 'text-cyan-300' : 'text-gray-300'
              }`}
            >
              {version}
            </span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getTypeBadge(type)}`}>
              {type}
            </span>
          </div>
        </button>
      </li>
    ));
  }, [versions, activeVersion, scrollToVersion]);

  // Scroll the horizontal version bar when active version changes
  useEffect(() => {
    if (activeVersion && horizontalScrollRef.current) {
      // Find the active button by data attribute
      const activeButton = horizontalScrollRef.current.querySelector(
        `button[data-version="${activeVersion}"]`
      );

      if (activeButton) {
        // Increased delay to ensure DOM is ready, especially important for mobile
        setTimeout(() => {
          // Calculate position to center the active button in the scrollbar
          const scrollbarWidth = horizontalScrollRef.current.clientWidth;
          const buttonLeft = activeButton.offsetLeft;
          const buttonWidth = activeButton.offsetWidth;

          // Center the button in the scrollbar view
          const scrollPosition = Math.max(0, buttonLeft - scrollbarWidth / 2 + buttonWidth / 2);

          // Use smooth scrolling for a better user experience
          horizontalScrollRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth',
          });
        }, 300); // Increased delay for more reliable scrolling on mobile
      }
    }
  }, [activeVersion]);

  // Initial setup and document title
  useEffect(() => {
    document.title = 'Worther - Changelog';

    // Cleanup function
    return () => {
      if (activeVersionTimeoutRef.current) {
        clearTimeout(activeVersionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-cyan-400 leading-relaxed">
          Changelog
        </h1>
        <p className="text-center mb-6 text-blue-300">
          Current Version: <span className="font-semibold">{packageJson.version}</span>
        </p>

        {/* Horizontal version selector - visible on all screens up to xl breakpoint */}
        <div className="flex overflow-x-auto py-2 px-1 mb-6 xl:hidden" ref={horizontalScrollRef}>
          <div className="flex space-x-2">{horizontalVersionButtons}</div>
        </div>

        <div className="flex xl:gap-0">
          {/* Main Changelog Content with Version History on the left side */}
          <div className="flex-1 max-w-4xl mx-auto">
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800 markdown-body relative">
              {/* Version History sidebar positioned absolutely to be exactly to the left of the content - only on xl screens */}
              <div className="hidden xl:block absolute -left-[210px] top-0 w-[200px]">
                <div className="sticky top-6 bg-black/30 p-4 rounded-xl border border-gray-800">
                  <h2 className="text-lg font-bold mb-3 text-cyan-400">Version History</h2>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 changelog-sidebar">
                    <ul className="space-y-1.5">{sidebarVersionButtons}</ul>
                  </div>
                </div>
              </div>

              <div
                ref={changelogContentRef}
                className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 pb-4 changelog-scroll"
                aria-label="Changelog content"
                onScroll={() => {
                  // Reset manual scroll flag if user scrolls manually after a longer period
                  if (Date.now() - lastManualScrollRef.current > 1000) {
                    lastManualScrollRef.current = 0;
                  }
                }}
              >
                {/* Custom markdown parser to manually handle version headings */}
                <div>
                  {markdown.split(/(?=## \d+\.\d+\.\d+ \([^)]+\))/g).map((section, index) => {
                    if (index === 0 && !section.match(/^## \d+\.\d+\.\d+ \([^)]+\)/)) {
                      // This is content before the first version heading
                      return (
                        <ReactMarkdown
                          key="intro"
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, children, ...props }) => (
                              <h1
                                className="text-3xl font-bold my-6 pb-3 border-b border-gray-700 text-blue-400 leading-relaxed"
                                {...props}
                              >
                                {children || 'Heading'}
                              </h1>
                            ),
                            h2: ({ node, children, ...props }) => (
                              <h2
                                className="text-2xl font-bold mt-6 mb-4 text-blue-300 leading-relaxed"
                                {...props}
                              >
                                {children || 'Heading'}
                              </h2>
                            ),
                            h3: ({ node, children, ...props }) => (
                              <h3
                                className="text-xl font-semibold mt-5 mb-3 text-cyan-400"
                                {...props}
                              >
                                {children || 'Heading'}
                              </h3>
                            ),
                            p: ({ node, ...props }) => (
                              <p className="my-3 text-gray-200 leading-relaxed" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-6 my-3 space-y-2" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-gray-300 pb-1" {...props} />
                            ),
                            a: ({ node, href, children, ...props }) => (
                              <a
                                href={href}
                                className="text-blue-400 hover:text-blue-300 underline"
                                {...props}
                              >
                                {children || href || 'Link'}
                              </a>
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="bg-gray-800 px-1 py-0.5 rounded text-sm text-cyan-300"
                                {...props}
                              />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-3"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold text-white" {...props} />
                            ),
                          }}
                        >
                          {section}
                        </ReactMarkdown>
                      );
                    }

                    const versionMatch = section.match(/^## (\d+\.\d+\.\d+) \(([^)]+)\)/);
                    if (!versionMatch) return null;

                    const version = versionMatch[1];
                    const type = versionMatch[2];
                    const versionId = `version-${version}`;

                    return (
                      <div
                        key={versionId}
                        id={versionId}
                        ref={el => {
                          if (el) versionElementsRef.current[version] = el;
                        }}
                        data-version={version}
                        className="py-2"
                      >
                        <div className="flex flex-wrap items-center gap-3 mt-6 mb-4">
                          <h2
                            className={`text-2xl font-bold leading-relaxed will-change-colors transition-colors duration-700 ease-in-out ${
                              activeVersion === version ? 'text-cyan-300' : 'text-blue-300'
                            }`}
                          >
                            {version}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(type)}`}
                          >
                            {type}
                          </span>
                        </div>

                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Skip h2 rendering since we manually handled it above
                            h2: () => null,
                            h3: ({ node, children, ...props }) => (
                              <h3
                                className="text-xl font-semibold mt-5 mb-3 text-cyan-400"
                                {...props}
                              >
                                {children || 'Heading'}
                              </h3>
                            ),
                            p: ({ node, ...props }) => (
                              <p className="my-3 text-gray-200 leading-relaxed" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-6 my-3 space-y-2" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-gray-300 pb-1" {...props} />
                            ),
                            a: ({ node, href, children, ...props }) => (
                              <a
                                href={href}
                                className="text-blue-400 hover:text-blue-300 underline"
                                {...props}
                              >
                                {children || href || 'Link'}
                              </a>
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="bg-gray-800 px-1 py-0.5 rounded text-sm text-cyan-300"
                                {...props}
                              />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-3"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold text-white" {...props} />
                            ),
                          }}
                        >
                          {section}
                        </ReactMarkdown>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
