import { Activity, useState, useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import { RiMenu4Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { NAV_ITEMS, NAV_ICONS } from '@constants/headerConstants.jsx';
import useSettingsStore from '@stores/settingsStore';

function Navigations({ text, path, currentLocation, onNavigate }) {
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
}

export function Dropdown(props) {
  const [opened, setOpened] = useState(false);
  const [activityMode, setActivityMode] = useState('hidden');
  const [animating, setAnimating] = useState(false);
  const dropdownRef = useRef(null);

  const { theme, setTheme } = useSettingsStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    closeMenu();
  };

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

  // Handle activity mode and animation states
  useEffect(() => {
    if (opened) {
      // Opening: Show immediately with animating=false, then animate in
      setActivityMode('visible');
      setAnimating(false); // Ensure we start from the non-animated state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true);
        });
      });
    } else {
      // Closing: Animate out first, then hide after animation completes
      setAnimating(false);
      const timer = setTimeout(() => {
        setActivityMode('hidden');
      }, 300); // Match with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [opened]);

  const openMenu = () => {
    setOpened(true);
  };

  const closeMenu = () => {
    setOpened(false);
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
        className="flex items-center justify-center p-2 text-gray-200 hover:text-cyan-300 transition-colors duration-200 rounded-full hover:bg-slate-800/50 overflow-hidden"
        aria-label={opened ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <div className="relative w-7 h-7">
          <MdClose
            size="28"
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              opened ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
            }`}
          />
          <RiMenu4Line
            size="28"
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              opened ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
        </div>
      </button>

      <Activity mode={activityMode}>
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
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex justify-start px-5 py-3 items-center gap-3 uppercase text-base font-medium text-gray-200 hover:text-white hover:bg-slate-800/30 transition-all duration-200 border-l-2 border-transparent"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="text-lg">
                {theme === 'dark' ? NAV_ICONS.LightMode : NAV_ICONS.DarkMode}
              </span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </nav>
      </Activity>
    </div>
  );
}
