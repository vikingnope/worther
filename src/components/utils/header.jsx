import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { NAV_ITEMS, NAV_ICONS } from '@constants/headerConstants.jsx';
import Logo from '@resources/logo_transparent.png';
import useSettingsStore from '@stores/settingsStore';
import { Dropdown } from '@utils/mobileDropdown';

function NavigationLink({ text, path, currentLocation }) {
  const active = currentLocation === path;

  return (
    <Link
      to={path}
      className={`group relative mr-3 flex items-center gap-2 px-3 py-2 text-lg font-medium uppercase transition-all duration-300 ease-in-out ${active ? 'text-cyan-300' : 'text-gray-300 hover:text-white'}`}
      aria-label={`Navigate to ${text}`}
    >
      <span className="transition-all duration-300">{NAV_ICONS[text] ?? null}</span>
      <span>{text}</span>
      {/* Animated underline effect */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transform transition-all duration-300 ${active ? 'scale-x-100 bg-cyan-300' : 'scale-x-0 bg-cyan-500 group-hover:scale-x-100'}`}
      ></span>
    </Link>
  );
}

export function Header() {
  const history = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  let location = '/' + useLocation().pathname.split('/')[1];

  const { theme, setTheme } = useSettingsStore();

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

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

  function handleClick(e) {
    e.preventDefault();
    history('/');
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 py-1 shadow-lg backdrop-blur-md'
            : 'bg-gradient-to-b from-slate-900/90 to-slate-900/70 py-2'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <button
                onClick={handleClick}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleClick(e);
                }}
                className="flex cursor-pointer items-center border-0 bg-transparent"
                aria-label="Navigate to home page"
              >
                <img
                  draggable="false"
                  src={Logo}
                  className="h-[50px] w-[50px] transition-all duration-300 ease-in-out hover:brightness-110 hover:drop-shadow-[0_0_3px_rgba(34,211,238,0.5)] hover:filter"
                  alt="logo"
                />
                <span className="animate-text ml-3 hidden bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent sm:block">
                  Worther
                </span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex items-center">
              {/* Desktop navigation - visible on lg screens and up */}
              <div className="hidden items-center space-x-1 lg:flex">
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
                  className="relative mr-2 flex cursor-pointer items-center px-3 py-2 text-lg text-gray-300 transition-all duration-300 hover:text-white"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <span className="transition-all duration-300 hover:rotate-12">
                    {theme === 'dark' ? NAV_ICONS.LightMode : NAV_ICONS.DarkMode}
                  </span>
                </button>

                <Link
                  to="/settings"
                  className={`relative ml-1 flex items-center px-3 py-2 text-lg transition-all duration-300 ${
                    location === '/settings' ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
                  }`}
                  aria-label="Navigate to settings"
                >
                  <span className="transition-transform duration-300 hover:rotate-12">
                    {NAV_ICONS.Settings}
                  </span>
                  {/* Animated underline effect */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transform transition-all duration-300 ${location === '/settings' ? 'scale-x-100 bg-cyan-300' : 'scale-x-0 bg-cyan-500 group-hover:scale-x-100'}`}
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
      <div className="h-[65px] w-full"></div>
    </>
  );
}
