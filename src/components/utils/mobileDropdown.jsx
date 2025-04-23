import { useState, useEffect, useRef, memo } from 'react';
import { MdClose } from 'react-icons/md';
import { RiMenu4Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { NAV_ITEMS, NAV_ICONS } from '../../constants/headerConstants.jsx';

const Navigations = memo(({ text, path, currentLocation, onNavigate }) => {
  const active = currentLocation === path;

  return (
    <Link
      to={path}
      className={`flex justify-start px-5 py-3 items-center gap-3 uppercase text-base font-medium ${
        active
          ? 'text-cyan-300 bg-slate-800/50'
          : 'text-gray-200 hover:text-white hover:bg-slate-800/30'
      } transition-all duration-200 border-l-2 ${active ? 'border-cyan-300' : 'border-transparent'}`}
      aria-label={`Navigate to ${text}`}
      onClick={onNavigate}
    >
      <span className="text-lg">{NAV_ICONS[text] ?? null}</span>
      {text}
    </Link>
  );
});

Navigations.displayName = 'Navigations';

export const Dropdown = memo(props => {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle animation states when opened state changes
  useEffect(() => {
    if (opened) {
      setVisible(true);
      // Small delay to ensure DOM update before animation starts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true);
        });
      });
    } else {
      setAnimating(false);
    }
  }, [opened]);

  // Handle visibility after animation completes
  useEffect(() => {
    if (!animating && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // Match duration with the CSS transition
      return () => clearTimeout(timer);
    }
  }, [animating, visible]);

  const openMenu = () => {
    setOpened(true);
  };

  const closeMenu = () => {
    setAnimating(false);
    // Actual closing is handled by the effect above
    setTimeout(() => {
      setOpened(false);
    }, 50);
  };

  const toggleMenu = () => {
    if (!opened) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-2 text-gray-200 hover:text-cyan-300 transition-colors duration-200 rounded-full hover:bg-slate-800/50"
        aria-label={opened ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {opened ? <MdClose size="28" /> : <RiMenu4Line size="28" />}
      </button>

      {(opened || visible) && (
        <nav className="absolute right-0 z-50 mt-2 min-w-[220px]">
          <div
            className={`flex flex-col rounded-lg bg-slate-900/95 backdrop-blur-md shadow-lg overflow-hidden
                      transition-all duration-300 ease-in-out origin-top
                      ${animating ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform -translate-y-2 scale-95'}`}
          >
            {NAV_ITEMS.map((item, index) => (
              <Navigations
                key={index}
                text={item.text}
                path={item.path}
                currentLocation={props.location}
                onNavigate={closeMenu}
              />
            ))}
            {/* Settings navigation */}
            <Link
              to="/settings"
              className={`flex justify-start px-5 py-3 items-center gap-3 uppercase text-base font-medium ${
                props.location === '/settings'
                  ? 'text-cyan-300 bg-slate-800/50'
                  : 'text-gray-200 hover:text-white hover:bg-slate-800/30'
              } transition-all duration-200 border-l-2 ${props.location === '/settings' ? 'border-cyan-300' : 'border-transparent'}`}
              aria-label="Navigate to settings"
              onClick={closeMenu}
            >
              <span className="text-lg">{NAV_ICONS.Settings}</span>
              Settings
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown Navigation';
