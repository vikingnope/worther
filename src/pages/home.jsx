import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function Home() {
    return (
        <div className='select-none text-white overflow-hidden'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center">
                <p className="uppercase font-bold md:text-8xl text-5xl mt-20 text-green-500">
                    Worther
                </p>
                <p className="uppercase md:text-5xl text-3xl mt-7 mb-10 text-sky-400">
                    Getting weather closer to you
                </p>
                <section className='my-16'>
                    <a href='/map/light' className='uppercase md:text-5xl text-3xl underline block w-max font-bold hover:text-cyan-300 hover:text-6xl duration-500 md:mb-10 mb-5'>Map</a>
                    <a href='/weather' className='uppercase md:text-5xl text-3xl underline w-max block font-bold hover:text-cyan-300 hover:text-6xl duration-500 md:mb-10 mb-5'>Weather</a>
                    <a href='/recommendations' className='uppercase md:text-5xl text-3xl block underline w-max font-bold hover:text-cyan-300 hover:text-6xl duration-500 md:mb-10 mb-5'>Recommendations</a>
                    <a href='/about' className='uppercase md:text-5xl text-3xl block underline w-max font-bold hover:text-cyan-300 hover:text-6xl duration-500'>About</a>
                </section>
            </div>
            <Footer />
        </div>
    )
}
