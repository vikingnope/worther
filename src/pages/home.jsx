import logo from '../resources/logo.png';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import lightMode from '../resources/lightMode.png';


export default function Home() {
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center justify-center">
                <main>
                    <a href='/map'>
                        <img src={lightMode} className="mb-7 rounded border-2 hover:border-red-800 opacity-90 w-3/4 hover:w-4/5 duration-300 h-4/5" alt="map" />
                    </a>
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
