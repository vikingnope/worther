import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import lightMode from '../resources/lightMode.png';
import darkMode from '../resources/darkMode.png';


export default function Home() {
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center">
                <main>
                    <div className='flex'>
                        <div id="homeImagesDiv">
                            <a href='/map/light'>
                                <p className='relative top-96 left-3.5 flex font-bold text-black text-2xl'>Light Map</p>
                                <img src={lightMode} className="mx-auto mt-5 hover:border-red-700 duration-300 rounded border-zinc-600 border-3" alt="light map" />
                            </a>
                        </div>
                        <div id="homeImagesDiv">
                            <a href='/map/dark'>
                                <p className='relative top-96 left-3.5 flex font-bold text-2xl'>Dark Map</p>
                                <img src={darkMode} className="mx-auto mt-5 hover:border-red-700 duration-300 rounded border-zinc-600 homeImages border-3" alt="dark map" />
                            </a>
                        </div>
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
