import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function Home() {

    const siteMapStyling = 'uppercase md:text-5xl text-3xl underline block w-max font-bold hover:text-cyan-300 duration-300'

    return (
        <div className='flex flex-col min-h-screen text-white overflow-hidden bg-black'>
            <Header/>
            <div className="flex-grow text-center flex flex-col items-center justify-center">
                <p className="uppercase font-bold md:text-8xl text-5xl text-green-500">
                    Worther
                </p>
                <p className="uppercase md:text-5xl text-2xl mt-5 mb-10 text-sky-400">
                    Getting weather closer to you
                </p>
                <section className='my-10'>
                    <a href='/map/light' className={`${siteMapStyling} md:mb-10 mb-5`}>Map</a>
                    <a href='/weather' className={`${siteMapStyling} md:mb-10 mb-5`}>Weather</a>
                    <a href='/recommendations' className={`${siteMapStyling} md:mb-10 mb-5`}>Recommendations</a>
                    <a href='/about' className={siteMapStyling}>About</a>
                </section>
            </div>
            <Footer />
        </div>
    )
}