import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SITE_MAP = [
    { text: 'Map', path: '/map/light' },
    { text: 'Weather', path: '/weather' },
    { text: 'Recommendations', path: '/recommendations' },
    { text: 'About', path: '/about' }
];

const SITE_MAP_STYLING = 'uppercase md:text-5xl text-3xl underline block w-max font-bold hover:text-cyan-300 duration-300 md:mb-10 mb-5';

export default function Home() {

    useEffect(() => {
        document.title = "Worther - Home";
    }, []);

    return (
        <div className='flex flex-col min-h-screen text-white overflow-hidden bg-black'>
            <Header/>
            <main className="flex-grow text-center flex flex-col items-center justify-center">
                <h1 className="uppercase font-bold md:text-8xl text-5xl text-green-500">
                    Worther
                </h1>
                <p className="uppercase md:text-5xl text-2xl mt-5 mb-10 text-sky-400">
                    Getting weather closer to you
                </p>
                <nav className='my-10' aria-label="Main navigation">
                    {SITE_MAP.map((item, index) => (
                        <Link key={index} to={item.path} className={SITE_MAP_STYLING} aria-label={`Navigate to ${item.text}`}>
                            {item.text}
                        </Link>
                    ))}
                </nav>
            </main>
            <Footer />
        </div>
    )
}