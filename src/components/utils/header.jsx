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
      className={`flex uppercase items-center gap-2 text-2xl mt-2 hover:text-cyan-300 transition-all duration-200 ease-in-out mr-6 ${active}`}
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
    <header className="inset-x-0 top-0 bg-gradient-to-b from-slate-900 to-black h-min w-full shadow-md select-none z-10">
      <section className="relative">
        <button
          onClick={handleClick}
          onKeyDown={e => {
            if (e.key === 'Enter') handleClick(e);
          }}
          className="bg-transparent border-0 cursor-pointer"
          aria-label="Navigate to home page"
        >
          <img
            draggable="false"
            src={Logo}
            className="transition-all duration-200 ease-in-out ml-3.5 rounded shadow-md hover:shadow-lg hover:scale-105"
            alt="logo"
            width="60"
            height="60"
          />
        </button>
      </section>

      <nav className="absolute right-0 top-2.5 flex">
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
