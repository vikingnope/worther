import logo from '../../resources/logoSmall.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from './mobileDropdown';
import { AiFillHome } from 'react-icons/ai';
import { BsFillMapFill, BsCloudSunFill } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { TbBeach } from 'react-icons/tb';


export const Header = () => {
    const history = useNavigate();
    let location = "/" + useLocation().pathname.split('/')[1];

    if (location === '/weatherCountry' || location === '/weatherLocation' || location === '/3HourForecast' || location === '/dailyWeather' || location === '/Single3HourForecast' || location === '/advancedWeather') {
        location = '/weather';
    } else if (location === '/map') {
        location = '/map/light';
    }

    const handleClick = (e) => {
        e.preventDefault();

        history('/');
    };

    const Navigations = (text, path) => {

        const active = (location === path) ? 'text-green-300' : 'text-white';

        return(
            <a href={path} className={`flex uppercase items-center gap-2 text-2xl mt-2 hover:text-green-300 duration-150 mr-6 ${active}`}>
                {(text === 'Home') ?
                    <AiFillHome size='25'/> :
                (text === 'Map') ?
                    <BsFillMapFill size='22'/> :
                (text === 'Weather') ?
                    <BsCloudSunFill size='25'/> :
                (text === 'Recommendations') ?
                    <TbBeach size='25'/> :
                (text === 'About') ?
                    <HiInformationCircle size='26'/> :
                    <></>         
                }
                {text}
            </a>
        )
    };

    return (
        <header className="inset-x-0 top-0 bg-neutral-800 h-min w-full border-y border-zinc-600 select-none">
            <section className="relative mt-2">
                <img onClick={handleClick} draggable='false' src={logo} className="-mt-2.5 border-3 hover:scale-90 hover:border-cyan-300 duration-150 cursor-pointer ml-2.5 scale-75 rounded-full" alt="logo" width="65" height="65" />
            </section>

            <nav className="absolute right-0 top-2.5 flex">
                {/* Desktop navigation - visible on md screens and up */}
                <div className="hidden lg:flex">
                    {[
                    Navigations('Home', '/'), 
                    Navigations('Map', '/map/light'), 
                    Navigations('Weather', '/weather'),
                    Navigations('Recommendations', '/recommendations'), 
                    Navigations('About', '/about')
                    ].map((item) => (
                        <span key={item.props.href}>{item}</span>
                    ))}
                </div>
                
                {/* Mobile dropdown - visible below md screens */}
                <div className="lg:hidden">
                    <Dropdown location={location}/>
                </div>
            </nav>
        </header>          
    )
};