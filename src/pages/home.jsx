import '../styles/map.scss';
import logo from '../resources/logo.png';
import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';


export default function Home() {
    return (
        <div className="text-center select-none bg-black min-h-screen flex flex-col items-center justify-center text-white">
            <Header choice={'home'}/>
            <main>
                <img src={logo} className="m-7 ml-24 App-logo rounded-full" alt="logo" />
                <p className="uppercase font-bold text-7xl">
                    Worther
                </p>
                <p className="uppercase text-3xl mt-7">
                    Getting weather closer to you
                </p>
            </main>
            <Footer />
        </div>
    );
}
