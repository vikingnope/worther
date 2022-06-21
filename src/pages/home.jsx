import '../styles/home.css';
import logo from '../resources/logo.png';
import React from 'react';


export default function Home() {
    return (
        <div className="text-center select-none">
            <header className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
                <img src={logo} className="m-5 App-logo rounded-full" alt="logo" />
                <p className="uppercase font-bold text-7xl">
                    Worther
                </p>
                <a href="/map" className="uppercase font-bold text-3xl underline m-3 text-blue-400">
                    Map
                </a>
                <a href="/about" className="uppercase font-bold text-3xl underline">
                    About
                </a>
            </header>
        </div>
    );
}
