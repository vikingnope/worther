import React, {useState} from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useNavigate } from 'react-router-dom';
import lightModeImage from '../resources/lightMode.png';
import darkModeImage from '../resources/darkMode.png';
import { isMobile, isDesktop } from 'react-device-detect';

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
                    <button className='underline inline' type='submit'>
                        Light Mode Map
                        {
                        (isDesktop) ?
                            <img src={lightModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-xl border-2 border-zinc-600" /> :
                            <img src={lightModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-sm border-2 border-zinc-600" />
                        }
                    </button>   
                </form>
                <form onSubmit={handleSubmitDark}>
                    <button className='underline inline mt-12' type='submit'>
                        Dark Mode Map
                        {
                        (isDesktop) ?
                            <img src={darkModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-xl border-2 border-zinc-600" /> :
                            <img src={darkModeImage} draggable='false' className="mx-auto mt-5 rounded-md max-w-sm border-2 border-zinc-600" />
                        }
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
