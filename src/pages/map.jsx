import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useNavigate } from 'react-router-dom';
import lightModeImage from '../resources/lightMode.png';
import darkModeImage from '../resources/darkMode.png';
import { isDesktop } from 'react-device-detect';
import { MdDarkMode } from 'react-icons/md'; // dark mode
import { MdOutlineDarkMode } from 'react-icons/md'; // light mode

export default function Home() {

    const history = useNavigate();

    const handleSubmitDark = (e) => {
        e.preventDefault();

        history('/map/' + 'dark');
    }

    const handleSubmitLight = (e) => {
        e.preventDefault();

        history('/map/' + 'light');
    }

    return (
        <div className='select-none text-white'>
            <Header choice={'map'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center underline justify-center text-3xl font-bold">
                <form onSubmit={handleSubmitLight}>
                    <button className='hover:text-green-300 hover:text-4xl underline duration-150 block' type='submit'>
                        <div className='justify-center flex'>
                            <div className='mt-1.5 mr-3'>
                                <MdDarkMode size='32'/>
                            </div>
                            Light Mode Map
                        </div>
                        {
                        (isDesktop) ?
                            <img src={lightModeImage} draggable='false' className="mx-auto mt-5 hover:border-green-300 hover:max-w-2xl duration-150 rounded-md max-w-xl border-2 border-zinc-600 flex" alt='light mode'/> :
                            <img src={lightModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-sm border-2 border-zinc-600" alt='light mode'/>
                        }
                    </button>   
                </form>
                <form onSubmit={handleSubmitDark}>
                    <button className='hover:text-green-300 hover:text-4xl duration-150 underline inline mt-12' type='submit'>
                        <div className='justify-center flex'>
                            <div className='mt-1.5 mr-3'>
                                <MdOutlineDarkMode size='32'/>
                            </div>
                            Dark Mode Map
                        </div>
                        {
                        (isDesktop) ?
                            <img src={darkModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-xl border-2 hover:border-green-300 hover:max-w-2xl duration-150 border-zinc-600" alt='dark mode'/> :
                            <img src={darkModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-sm border-2 border-zinc-600" alt='dark mode'/>
                        }
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
