import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { useEffect, useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import packageJson from "../../package.json";
import CHANGELOG from '../resources/CHANGELOG.md?raw';

export default function Changelog() {
  const [markdown, setMarkdown] = useState(CHANGELOG);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const markdownRef = useRef(markdown);
  
  // Update ref when markdown changes
  useEffect(() => {
    markdownRef.current = markdown;
  }, [markdown]);
  
  const reloadChangelog = useCallback(() => {
    // We already have the static import, so we don't need to fetch if running in development
    if (import.meta.env.DEV) {
      return; // Skip fetching in development mode
    }
    
    // Use fetch API with the correct public path for the changelog
    fetch('./src/resources/CHANGELOG.md', { 
      cache: 'no-store', // Ensure we don't use cached version
      headers: { 'Cache-Control': 'no-cache' } 
    })
      .then(response => {
        if (!response.ok) {
          // Fallback to root-relative path if the first path fails
          return fetch('/CHANGELOG.md', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' } 
          });
        }
        return response;
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch changelog: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        // Validate the content is actually markdown and not HTML
        if (content.includes('<!DOCTYPE html>') || content.startsWith('<html')) {
          console.warn('Received HTML instead of markdown, ignoring update');
          return;
        }
        
        // Only update if content has changed and looks like markdown
        if (content !== markdownRef.current && 
            (content.includes('#') || content.includes('- ') || content.includes('* '))) {
          setMarkdown(content);
          setLastUpdated(Date.now());
        }
      })
      .catch(err => {
        console.error('Failed to reload changelog:', err);
        // In case of error, we still have the default content from the static import
      });
  }, []);

  // Initial setup and document title
  useEffect(() => {
    document.title = "Worther - Changelog";
    
    // Check for updates when the page visibility changes (user comes back to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        reloadChangelog();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Periodic check for updates (every 60 seconds)
    const intervalId = setInterval(reloadChangelog, 60000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [reloadChangelog]);

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header/>
      <main className="flex-grow py-8 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-cyan-400 leading-relaxed">
            Changelog
          </h1>
          <p className="text-center mb-8 text-blue-300">
            Current Version: <span className="font-semibold">{packageJson.version}</span>
          </p>
          
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800 markdown-body">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 pb-4 changelog-scroll" aria-label="Changelog content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-6 pb-3 border-b border-gray-700 text-blue-400 leading-relaxed" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-4 text-blue-300 leading-relaxed" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-5 mb-3 text-cyan-400" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 text-gray-200 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-300 pb-1" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                  code: ({node, ...props}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm text-cyan-300" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-3" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800 text-gray-500 text-sm text-right">
              Last checked for updates: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}