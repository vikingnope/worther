import logo from '../../resources/logoSmall.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile, isDesktop } from 'react-device-detect';
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
            <a href={path} className={`uppercase text-2xl mr-7 hover:text-green-300 duration-150 ${active}`}>
                <div className='mt-2 flex'>
                    <div className='mr-2'>
                        {(text === 'Home') ?
                            <div className='mt-1'>
                                <AiFillHome size='25'/>
                            </div> :
                        (text === 'Map') ?
                            <div className='mt-1.5'>
                                <BsFillMapFill size='22'/>
                            </div> :
                        (text === 'Weather') ?
                            <div className='mt-1'>
                                <BsCloudSunFill />
                            </div> :
                        (text === 'Recommendations') ?
                            <div className='mt-1'>
                                <TbBeach />
                            </div> :
                        (text === 'About') ?
                            <div className='mt-1'>
                                <HiInformationCircle size='25'/>
                            </div> :
                            <></>         
                        }
                    </div>
                    {text}
                </div>
            </a>
        )
    };

    return (
        <header className="inset-x-0 top-0 bg-neutral-800 h-min w-full border-y border-zinc-600 select-none">
            <section className="relative mt-2">
                <img onClick={handleClick} draggable='false' src={logo} className="-mt-2.5 border-3 hover:scale-90 hover:border-cyan-300 duration-150 cursor-pointer ml-2.5 scale-75 rounded-full" alt="logo" />
            </section>

            <nav className="absolute right-0 top-2.5 flex">
                {(isDesktop) ?
                (
                    [
                    Navigations('Home', '/'), 
                    Navigations('Map', '/map/light'), 
                    Navigations('Weather', '/weather'),
                    Navigations('Recommendations', '/recommendations'), 
                    Navigations('About', '/about')
                    ]
                ) : (isMobile) ?
                    <Dropdown location={location}/> :
                    <></>
                }
            </nav>
        </header>          
    )
};