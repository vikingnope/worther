import logo from '../../resources/logoSmall.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from './mobileDropdown';
import { Link } from 'react-router-dom';
import { memo, useCallback } from 'react';
import { NAV_ITEMS, NAV_ICONS } from '../../constants/headerConstants';

const NavigationLink = memo(({ text, path, currentLocation }) => {
    const active = (currentLocation === path) ? 'text-green-300' : 'text-white';

    return (
        <Link to={path} className={`flex uppercase items-center gap-2 text-2xl mt-2 hover:text-green-300 duration-150 mr-6 ${active}`} aria-label={`Navigate to ${text}`}>
            {NAV_ICONS[text] ?? null}
            {text}
        </Link>
    );
});

NavigationLink.displayName = 'NavigationLink';


export const Header = memo(() => {
    const history = useNavigate();
    let location = "/" + useLocation().pathname.split('/')[1];

    if (location === '/weatherCountry' || location === '/weatherLocation' || location === '/3HourForecast' || location === '/dailyWeather' || location === '/Single3HourForecast' || location === '/advancedWeather') {
        location = '/weather';
    } else if (location === '/map') {
        location = '/map/light';
    }

    const handleClick = useCallback((e) => {
        e.preventDefault();

        history('/');
    }, [history]);

    return (
        <header className="inset-x-0 top-0 bg-neutral-800 h-min w-full border-y border-zinc-600 select-none">
            <section className="relative mt-2">
                <img onClick={handleClick} draggable='false' src={logo} className="-mt-2.5 border-3 hover:scale-90 hover:border-cyan-300 duration-150 cursor-pointer ml-2.5 scale-75 rounded-full" alt="logo" width="65" height="65" aria-label="Navigate to home page"/>
            </section>

            <nav className="absolute right-0 top-2.5 flex">
                {/* Desktop navigation - visible on md screens and up */}
                <div className="hidden lg:flex">
                    {NAV_ITEMS.map((item, index) => (
                        <NavigationLink key={index} text={item.text} path={item.path} currentLocation={location} />
                    ))}
                </div>
                
                {/* Mobile dropdown - visible below md screens */}
                <div className="lg:hidden">
                    <Dropdown location={location}/>
                </div>
            </nav>
        </header>          
    )
});

Header.displayName = 'Header';