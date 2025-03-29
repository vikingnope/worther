import logo from '../../resources/logoSmall.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from './mobileDropdown';
import { AiFillHome } from 'react-icons/ai';
import { BsFillMapFill, BsCloudSunFill } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { TbBeach } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { memo, useCallback } from 'react';

const NAV_ITEMS = [
    { text: 'Home', path: '/' },
    { text: 'Map', path: '/map/light' },
    { text: 'Weather', path: '/weather' },
    { text: 'Recommendations', path: '/recommendations' },
    { text: 'About', path: '/about' }
];

const NAV_ICONS = {
    Home: <AiFillHome size='25'/>,
    Map: <BsFillMapFill size='22'/>,
    Weather: <BsCloudSunFill size='25'/>,
    Recommendations: <TbBeach size='25'/>,
    About: <HiInformationCircle size='26'/>
};

const NavigationLink = memo(({ text, path }) => {
    const location = "/" + useLocation().pathname.split('/')[1];
    const active = (location === path) ? 'text-green-300' : 'text-white';

    return (
        <Link to={path} className={`flex uppercase items-center gap-2 text-2xl mt-2 hover:text-green-300 duration-150 mr-6 ${active}`} aria-label={`Navigate to ${text}`}>
            {NAV_ICONS[text] || <></>}
            {text}
        </Link>
    );
});


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
                        <NavigationLink key={index} text={item.text} path={item.path} />
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