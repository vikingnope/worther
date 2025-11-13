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
      className={`flex items-center justify-start gap-3 px-5 py-3 text-base font-medium uppercase ${
        active
          ? 'bg-slate-800/50 text-cyan-300'
          : 'text-gray-200 hover:bg-slate-800/30 hover:text-white'
      } border-l-2 transition-all duration-200 ${active ? 'border-cyan-300' : 'border-transparent'}`}
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
        className="flex items-center justify-center overflow-hidden rounded-full p-2 text-gray-200 transition-colors duration-200 hover:bg-slate-800/50 hover:text-cyan-300"
        aria-label={opened ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <div className="relative h-7 w-7">
          <MdClose
            size="28"
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              opened ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'
            }`}
          />
          <RiMenu4Line
            size="28"
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              opened ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
            }`}
          />
        </div>
      </button>

      <Activity mode={activityMode}>
        <nav className="absolute right-0 z-50 mt-2 min-w-[220px]">
          <div
            className={`flex origin-top flex-col overflow-hidden rounded-lg bg-slate-900/95 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${animating ? 'translate-y-0 scale-100 transform opacity-100' : '-translate-y-2 scale-95 transform opacity-0'}`}
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
              className={`flex items-center justify-start gap-3 px-5 py-3 text-base font-medium uppercase ${
                props.location === '/settings'
                  ? 'bg-slate-800/50 text-cyan-300'
                  : 'text-gray-200 hover:bg-slate-800/30 hover:text-white'
              } border-l-2 transition-all duration-200 ${props.location === '/settings' ? 'border-cyan-300' : 'border-transparent'}`}
              aria-label="Navigate to settings"
              onClick={closeMenu}
            >
              <span className="text-lg">{NAV_ICONS.Settings}</span>
              Settings
            </Link>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-start gap-3 border-l-2 border-transparent px-5 py-3 text-base font-medium text-gray-200 uppercase transition-all duration-200 hover:bg-slate-800/30 hover:text-white"
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
