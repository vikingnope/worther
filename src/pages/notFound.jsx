import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';


export default function NotFound() {
    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            <div className="text-center bg-black flex min-h-screen flex-col items-center justify-center">
                <p className="uppercase font-bold text-5xl">
                    Error 404: The URL you have entered has not been found.
                </p>
                <a href='/' className="uppercase underline font-bold text-2xl mt-20">
                    Go home
                </a>
            </div>
            <Footer />
        </div>
    );
}
