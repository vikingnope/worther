import '../styles/map.css';
import logo from '../resources/logo.png';
import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';


export default function Home() {
    return (
        <div className="text-center select-none bg-black min-h-screen flex flex-col items-center justify-center text-white">
            <Header />
            <main>
                <img src={logo} className="m-5 App-logo rounded-full" alt="logo" />
                <p className="uppercase font-bold text-7xl">
                    Worther
                </p>
                <p className="uppercase text-3xl mt-7">
                    The new weather app
                </p>
            </main>
            <Footer />
        </div>
    );
}
