import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import lightMode from '../resources/lightMode.png';
import darkMode from '../resources/darkMode.png';


export default function Home() {
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center justify-center">
                <main>
                    <div className='flex'>
                        <a href='/map/light'>
                            <img src={lightMode} className="mx-auto mt-5 hover:border-green-300 duration-300 rounded-md max-w-6xl border-2 border-zinc-600 flex mr-10 h-5/6" alt="light map" />
                        </a>
                        <a href='/map/dark'>
                            <img src={darkMode} className="mx-auto mt-5 hover:border-green-300 duration-300 rounded-md max-w-6xl border-2 border-zinc-600 flex h-5/6" alt="dark map" />
                        </a>
                    </div>
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
