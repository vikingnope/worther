import { MdOutlineSegment } from 'react-icons/md';
import { useState } from 'react';
import { MdArrowLeft, MdOutlineArrowDropDown } from 'react-icons/md';
import { AiFillHome } from 'react-icons/ai';
import { BsFillMapFill, BsCloudSunFill } from 'react-icons/bs';
import { HiInformationCircle } from 'react-icons/hi';
import { TbBeach } from 'react-icons/tb';

export const Dropdown = (props) => {
    const [toggle, setToggle ] = useState(false);

    const Navigations = (text, path) => {
        return(
            <a href={path} className="h-14 flex justify-center uppercase text-2xl border-y-2 border-x-3 border-zinc-600 mr-1 bg-stone-900 indent-2">
                <div className='mx-3 mt-2 flex'>
                    <div className='mr-px'>
                        {(text === 'Home') ?
                            <div className='mt-1'>
                                <AiFillHome size='25'/>
                            </div> :
                        (text === 'Map') ?
                            <div className='mt-1.5'>
                                <BsFillMapFill size='23'/>
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
                                <HiInformationCircle size='25' color='white'/>
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
        <nav>
            <div className='mr-1'>
                <button onClick={() => setToggle(!toggle)} className='flex mt-1'>
                    <MdOutlineSegment size='42' />
                    <div className='mt-1 -ml-2'>
                    {(!toggle) ?
                            <MdArrowLeft size='35' /> :
                            <MdOutlineArrowDropDown size='35' />
                    }
                    </div>
                </button>
            </div>

            {(toggle) ?
            (<ul className={'absolute right-1 z-50 mt-1.5'}>
                <li>
                    {
                        (props.choice === 'about') ? 
                            [
                                Navigations('Home', '/'), 
                                Navigations('Map', '/map/light'), 
                                Navigations('Weather', '/weather'), 
                                Navigations('Recommendations', '/recommendations')
                            ] :
                        (props.choice === 'home') ?
                            [
                                Navigations('Map', '/map/light'), 
                                Navigations('Weather', '/weather'), 
                                Navigations('Recommendations', '/recommendations'), 
                                Navigations('About', '/about')
                            ] :
                        (props.choice === 'weather') ?
                            [
                                Navigations('Home', '/'), 
                                Navigations('Map', '/map/light'), 
                                Navigations('Recommendations', '/recommendations'), 
                                Navigations('About', '/about')
                            ] :
                        (props.choice === 'showWeather') ?
                            [
                                Navigations('Home', '/'), 
                                Navigations('Map', '/map/light'), 
                                Navigations('Weather', '/weather'), 
                                Navigations('Recommendations', '/recommendations'), 
                                Navigations('About', '/about')
                            ] :
                        (props.choice === 'showMap') ?
                            [   
                                Navigations('Home', '/'), 
                                Navigations('Map', '/map/light'), 
                                Navigations('Weather', '/weather'), 
                                Navigations('Recommendations', '/recommendations'), 
                                Navigations('About', '/about')
                            ] :
                        (props.choice === 'recommendations') ?
                        [
                            Navigations('Home', '/'), 
                            Navigations('Map', '/map/light'), 
                            Navigations('Weather', '/weather'), 
                            Navigations('About', '/about')
                        ] :
                        (choice === 'changelog') ?
                        [
                            Navigations('Home', '/'), 
                            Navigations('Map', '/map/light'), 
                            Navigations('Weather', '/weather'), 
                            Navigations('Recommendations', '/recommendations'), 
                            Navigations('About', '/about')
                        ] :
                        <></>
                    }
                </li>
            </ul>) :
            <></>
            }
        </nav>
    )
}