import logo from '../resources/logo.png';
import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';


export default function Home() {
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center justify-center">
                <main>
                    <img src={logo} className="mx-auto mb-7 App-logo rounded-full" alt="logo" />
                    <p className="uppercase font-bold text-7xl">
                        Worther
                    </p>
                    <p className="uppercase text-3xl mt-7">
                        Getting weather closer to you
                    </p>
                </main>
            </div>
            <Footer />
        </div>
    );
}
