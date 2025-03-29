import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Error() {
    
    useEffect(() => {
        document.title = "Worther - Error 404";
    }, []);

    return (
        <div className='text-white overflow-hidden bg-black'>
            <Header/>
            <main className="text-center flex min-h-screen flex-col items-center justify-center">
                <h1 className="font-bold text-5xl text-purple-400 mb-12">
                    Oops! This page has gone on holiday. It might return when it feels like it!
                </h1>

                <h2 className="font-bold text-3xl text-amber-400">
                    Error 404: The URL you have entered has not been found.
                </h2>

                <Link to='/' className="uppercase underline font-bold text-2xl mt-20 hover:text-cyan-300 duration-300" aria-label="Return to home page">
                    Go home
                </Link>
            </main>
            <Footer />
        </div>
    );
}
