import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function Forums () {
    document.title = "Worther - Forums";

    return (
        <div className="relative text-center select-none bg-black min-h-screen flex flex-col items-center text-white">
            <Header choice="forums"/>
            <p className='mt-16 font-bold text-4xl'>Forums</p>
            <Footer />
        </div>
    );
}