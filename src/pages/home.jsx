import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import lightMode from '../resources/lightMode.png';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Home() {
    const [ show, setShow ] = useState(0);
    
    useEffect(() => {
        if (show === 1){
            <div>
                <img src={lightMode} className="mx-auto mt-5 hover:border-red-700 duration-300 rounded border-zinc-600 border-3 opacity-80 w-2/3" alt="light map" />
            </div>
        }
    }, [show])

    // function showMap(){
    //     return(
    //     )
    // }

    return (
        <div className='select-none text-white'>
            <Header choice={'home'}/>
            {
                    (show === 1) ?
                        <div className="text-center bg-black flex min-h-screen flex-col items-center">
                            <img src={lightMode} className="mx-auto mt-5 hover:border-red-700 duration-1000 rounded border-zinc-600 border-3 opacity-40 w-screen h-screen" alt="light map" /> 
                        </div>:
                    (show === 10) ?
                        <img src={lightMode} className="mx-auto mt-5 hover:border-red-700 duration-1000 rounded border-zinc-600 border-3 opacity-70 w-screen h-screen" alt="light map" /> :
                    <></>
            }
            <div className="text-center bg-black flex min-h-screen flex-col items-center">
                <p className="uppercase font-bold text-7xl mt-10">
                    Worther
                </p>
                <p className="uppercase text-3xl mt-7 mb-10">
                    Getting weather closer to you
                </p>
                <ul>
                    <a href='/map' onMouseEnter={() => setShow(1)} onMouseLeave={() => setShow(0)} className='uppercase text-5xl underline block w-max mx-auto font-bold hover:text-cyan-300 hover:text-5xl duration-500 mb-5'>Map</a>
                    <a href='/weather' onMouseEnter={() => setShow(2)} onMouseLeave={() => setShow(0)} className='uppercase text-5xl underline w-max mx-auto block font-bold hover:text-cyan-300 hover:text-5xl duration-500 mb-5'>Weather</a>
                    <a href='/recommendations' onMouseEnter={() => setShow(3)} onMouseLeave={() => setShow(0)} className='uppercase text-5xl block underline w-max mx-auto font-bold hover:text-cyan-300 hover:text-5xl duration-500'>Recommendations</a>
                </ul>
                

            </div>
            <Footer />
        </div>
    );
}
