import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import lightMode from '../resources/lightMode.png';

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
                <a href='/map'>
                    <img src={lightMode} className="mx-auto mt-5 hover:border-red-700 duration-300 rounded border-zinc-600 border-3 opacity-80 w-screen" alt="light map" />
                </a>
            </div>
            <Footer />
        </div>
    );
}
