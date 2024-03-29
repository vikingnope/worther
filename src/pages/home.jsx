import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function Home() {
    
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center">
                <p className="uppercase font-bold text-8xl mt-20 text-green-500">
                    Worther
                </p>
                <p className="uppercase text-5xl mt-7 mb-10 text-sky-400">
                    Getting weather closer to you
                </p>
                <section className='my-16'>
                    <a href='/map/light' className='uppercase text-5xl underline block w-max font-bold hover:text-cyan-300 hover:text-6xl duration-500 mb-10'>Map</a>
                    <a href='/weather' className='uppercase text-5xl underline w-max block font-bold hover:text-cyan-300 hover:text-6xl duration-500 mb-10'>Weather</a>
                    <a href='/recommendations' className='uppercase text-5xl block underline w-max font-bold hover:text-cyan-300 hover:text-6xl duration-500 mb-10'>Recommendations</a>
                    <a href='/about' className='uppercase text-5xl block underline w-max font-bold hover:text-cyan-300 hover:text-6xl duration-500'>About</a>
                </section>
            </div>
            <Footer />
        </div>
    );
}
