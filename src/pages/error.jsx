import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';


export default function Error() {
    return (
        <div className='text-white overflow-hidden'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center justify-center">
                <p className="font-bold text-5xl text-purple-400 mb-12">
                    Oops! This page has gone on holiday. It might return when it feels like it!
                </p>
                <p className="font-bold text-3xl text-amber-400">
                    Error 404: The URL you have entered has not been found.
                </p>
                <a href='/' className="uppercase underline font-bold text-2xl mt-20 hover:text-cyan-300 duration-300">
                    Go home
                </a>
            </div>
            <Footer />
        </div>
    );
}
