import { memo, useCallback, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { NAV_ITEMS, NAV_ICONS } from '../../constants/headerConstants.jsx';
import useSettingsStore from '../../stores/settingsStore';

import Logo from './../../resources/logo_transparent.png';
import { Dropdown } from './mobileDropdown';

const NavigationLink = memo(({ text, path, currentLocation }) => {
  const active = currentLocation === path;

  return (
    <Link
      to={path}
      className={`relative flex uppercase items-center gap-2 text-lg font-medium py-2 px-3 transition-all duration-300 ease-in-out mr-3 group 
        ${active ? 'text-cyan-300' : 'text-gray-300 hover:text-white'}`}
      aria-label={`Navigate to ${text}`}
    >
      <span className="transition-all duration-300">{NAV_ICONS[text] ?? null}</span>
      <span>{text}</span>
      {/* Animated underline effect */}
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-all duration-300
        ${active ? 'bg-cyan-300 scale-x-100' : 'bg-cyan-500 scale-x-0 group-hover:scale-x-100'}`}
      ></span>
    </Link>
  );
});

NavigationLink.displayName = 'NavigationLink';

export const Header = memo(() => {
  const history = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  let location = '/' + useLocation().pathname.split('/')[1];

  const { theme, setTheme } = useSettingsStore();

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  if (
    location === '/weatherCountry' ||
    location === '/weatherLocation' ||
    location === '/3HourForecast' ||
    location === '/dailyWeather' ||
    location === '/Single3HourForecast' ||
    location === '/advancedWeather'
  ) {
    location = '/weather';
  }

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = useCallback(
    e => {
      e.preventDefault();
      history('/');
    },
    [history]
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-1'
            : 'bg-gradient-to-b from-slate-900/90 to-slate-900/70 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <button
                onClick={handleClick}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleClick(e);
                }}
                className="bg-transparent border-0 cursor-pointer flex items-center"
                aria-label="Navigate to home page"
              >
                <img
                  draggable="false"
                  src={Logo}
                  className="transition-all duration-300 ease-in-out h-[50px] w-[50px] hover:brightness-110 hover:filter hover:drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]"
                  alt="logo"
                />
                <span className="hidden sm:block ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text animate-text">
                  Worther
                </span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex items-center">
              {/* Desktop navigation - visible on lg screens and up */}
              <div className="hidden lg:flex items-center space-x-1">
                {NAV_ITEMS.map((item, index) => (
                  <NavigationLink
                    key={index}
                    text={item.text}
                    path={item.path}
                    currentLocation={location}
                  />
                ))}

                {/* Theme toggle button */}
                <button
                  onClick={toggleTheme}
                  className="relative flex items-center py-2 px-3 text-lg transition-all duration-300 mr-2 text-gray-300 hover:text-white"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <span className="transition-all duration-300 hover:rotate-12">
                    {theme === 'dark' ? NAV_ICONS.LightMode : NAV_ICONS.DarkMode}
                  </span>
                </button>

                <Link
                  to="/settings"
                  className={`relative flex items-center py-2 px-3 text-lg transition-all duration-300 ml-1 ${
                    location === '/settings' ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
                  }`}
                  aria-label="Navigate to settings"
                >
                  <span className="transition-transform duration-300 hover:rotate-12">
                    {NAV_ICONS.Settings}
                  </span>
                  {/* Animated underline effect */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-all duration-300
                    ${location === '/settings' ? 'bg-cyan-300 scale-x-100' : 'bg-cyan-500 scale-x-0 group-hover:scale-x-100'}`}
                  ></span>
                </Link>
              </div>

              {/* Mobile dropdown - visible below lg screens */}
              <div className="lg:hidden">
                <Dropdown location={location} />
              </div>
            </nav>
          </div>
        </div>
      </header>
      {/* Spacer div to push content down - responsive for different screen sizes */}
      <div className="h-[70px] lg:h-[72px] w-full"></div>
    </>
  );
});

Header.displayName = 'Header';
