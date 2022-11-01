import logo from '../../resources/logoSmall.png';
import { useNavigate } from 'react-router-dom';
import { isMobile, isDesktop } from 'react-device-detect';
import { Dropdown } from './mobileDropdown';
import { AiFillHome } from 'react-icons/ai';
import { BsFillMapFill, BsCloudSunFill } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { TbBeach } from 'react-icons/tb';


export const Header = ({choice}) => {
    const history = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();

        history('/');
    };

    const Navigations = (text, path) => {
        return(
            <a href={path} className="uppercase text-2xl mr-7 hover:text-green-300 hover:font-bold duration-150">
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
        <header className="inset-x-0 top-0 bg-neutral-800 h-min w-full border-y border-zinc-600">
            <section className="relative mt-2">
                <img onClick={handleClick} draggable='false' src={logo} className="-mt-2.5 border-4 hover:scale-90 hover:border-green-600 duration-150 cursor-pointer ml-2.5 scale-75 rounded-full" alt="logo" />
            </section>

            <nav className="absolute right-0 top-2.5 flex">
                {(isDesktop) ?
                (
                (choice === 'about') ? 
                    [
                        Navigations('Home', '/'), 
                        Navigations('Map', '/map'), 
                        Navigations('Weather', '/weather'), 
                        // Navigations('Recommendations', '/recommendations')
                    ] :
                (choice === 'home') ?
                    [
                        Navigations('Map', '/map'), 
                        Navigations('Weather', '/weather'), 
                        // Navigations('Recommendations', '/recommendations'), 
                        Navigations('About', '/about')
                    ] :
                (choice === 'weather') ?
                    [
                        Navigations('Home', '/'), 
                        Navigations('Map', '/map'), 
                        // Navigations('Recommendations', '/recommendations'), 
                        Navigations('About', '/about')] :
                (choice === 'showWeather') ?
                    [
                        Navigations('Home', '/'), 
                        Navigations('Map', '/map'), 
                        Navigations('Weather', '/weather'),
                        // Navigations('Recommendations', '/recommendations'), 
                        Navigations('About', '/about')
                    ] :
                (choice === 'map') ?
                    [
                        Navigations('Home', '/'), 
                        Navigations('Weather', '/weather'), 
                        // Navigations('Recommendations', '/recommendations'), 
                        Navigations('About', '/about')
                    ] :
                (choice === 'showMap') ?
                    [
                        Navigations('Home', '/'), 
                        Navigations('Map', '/map'), 
                        Navigations('Weather', '/weather'), 
                        // Navigations('Recommendations', '/recommendations'), 
                        Navigations('About', '/about')
                    ] :
                (choice === 'recommendations') ?
                    [
                        Navigations('Home', '/'), 
                        Navigations('Map', '/map'), 
                        Navigations('Weather', '/weather'), 
                        Navigations('About', '/about')
                    ] :
                <></>
                ) : (isMobile) ?
                    <Dropdown choice={choice}/> :
                    <></>
                }
            </nav>
        </header>          
    )
};