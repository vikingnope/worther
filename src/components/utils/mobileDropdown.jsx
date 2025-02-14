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

        let active = (props.location === path) ? 'text-green-300' : 'text-white';

        return(
            <a href={path} className={`h-14 flex justify-center px-3 items-center gap-2 uppercase text-2xl border-y-2 border-x-3 border-zinc-600 bg-stone-900 my-auto ${active}`}>
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
        <nav>
            <div className='mr-1'>
                <button onClick={() => setToggle(!toggle)} className='flex mt-0.5'>
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
                        [
                            Navigations('Home', '/'), 
                            Navigations('Map', '/map/light'), 
                            Navigations('Weather', '/weather'), 
                            Navigations('Recommendations', '/recommendations'), 
                            Navigations('About', '/about')
                        ]
                    }
                </li>
            </ul>) :
            <></>
            }
        </nav>
    )
}