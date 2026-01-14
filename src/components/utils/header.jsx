import { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { NAV_ITEMS, NAV_ICONS } from '../../constants/headerConstants.jsx';

import Logo from './../../resources/logo_transparent.png';
import { Dropdown } from './mobileDropdown';

const NavigationLink = memo(({ text, path, currentLocation }) => {
  const active = currentLocation === path ? 'text-cyan-300 font-medium' : 'text-gray-200';

  return (
    <Link
      to={path}
      className={`mt-2 mr-6 flex items-center gap-2 text-2xl uppercase transition-all duration-200 ease-in-out hover:text-cyan-300 ${active}`}
      aria-label={`Navigate to ${text}`}
    >
      {NAV_ICONS[text] ?? null}
      {text}
    </Link>
  );
});

NavigationLink.displayName = 'NavigationLink';

export const Header = memo(() => {
  const history = useNavigate();
  let location = '/' + useLocation().pathname.split('/')[1];

  if (
    location === '/weatherCountry' ||
    location === '/weatherLocation' ||
    location === '/3HourForecast' ||
    location === '/dailyWeather' ||
    location === '/Single3HourForecast' ||
    location === '/advancedWeather'
  ) {
    location = '/weather';
  } else if (location === '/map') {
    location = '/map/light';
  }

  const handleClick = useCallback(
    e => {
      e.preventDefault();
      history('/');
    },
    [history]
  );

  return (
    <header className="inset-x-0 top-0 z-10 h-min w-full bg-gradient-to-b from-slate-900 to-black shadow-md select-none">
      <section className="relative">
        <button
          onClick={handleClick}
          onKeyDown={e => {
            if (e.key === 'Enter') handleClick(e);
          }}
          className="cursor-pointer border-0 bg-transparent"
          aria-label="Navigate to home page"
        >
          <img
            draggable="false"
            src={Logo}
            className="ml-3.5 rounded shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
            alt="logo"
            width="60"
            height="60"
          />
        </button>
      </section>

      <nav className="absolute top-2.5 right-0 flex">
        {/* Desktop navigation - visible on lg screens and up */}
        <div className="hidden lg:flex">
          {NAV_ITEMS.map((item, index) => (
            <NavigationLink
              key={index}
              text={item.text}
              path={item.path}
              currentLocation={location}
            />
          ))}
        </div>

        {/* Mobile dropdown - visible below lg screens */}
        <div className="lg:hidden">
          <Dropdown location={location} />
        </div>
      </nav>
    </header>
  );
});

Header.displayName = 'Header';
