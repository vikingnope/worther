import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function Home() {
    
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center">
                <p className="uppercase font-bold text-7xl mt-10">
                    Worther
                </p>
                <p className="uppercase text-3xl mt-7 mb-10">
                    Getting weather closer to you
                </p>
                <ul className='my-16'>
                    <a href='/map' className='uppercase text-5xl underline block w-max font-bold hover:text-cyan-300 hover:text-5xl duration-500 mb-10'>Map</a>
                    <a href='/weather' className='uppercase text-5xl underline w-max block font-bold hover:text-cyan-300 hover:text-5xl duration-500 mb-10'>Weather</a>
                    <a href='/recommendations' className='uppercase text-5xl block underline w-max font-bold hover:text-cyan-300 hover:text-5xl duration-500'>Recommendations</a>
                </ul>
            </div>
            <Footer />
        </div>
    );
}
