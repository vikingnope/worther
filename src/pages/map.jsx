import React, {useState} from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useNavigate } from 'react-router-dom';
import lightModeImage from '../resources/lightMode.png'
import darkModeImage from '../resources/darkMode.png'

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
                        <img src={lightModeImage} className="mx-auto mt-5 rounded-md max-w-xl border-2 border-zinc-600"></img>
                    </button>   
                </form>
                <form onSubmit={handleSubmitDark}>
                    <button className='underline inline mt-12' type='submit'>
                        Dark Mode Map
                        <img src={darkModeImage} className="mx-auto mt-5 mb-5 rounded-md max-w-xl border-2 border-zinc-600"></img>
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
