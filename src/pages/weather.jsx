import { AiOutlineClose } from 'react-icons/ai';
import { GetOpenWeatherData } from "../components/openWeatherData"; 
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState } from 'react';
 
export default function Weather () {
  const[city, setCity] = useState();

  document.title = "Worther - Weather";

  return(
    <div className="text-center select-none bg-black text-white min-h-screen flex flex-col justify-center">
      <Header choice={'weather'}/>
      <p className='text-7xl mb-9'>
        Current Weather
      </p>
      <form onSubmit={GetOpenWeatherData(city)}>
        <input
            className="rounded w-44 h-7 text-black text-base font-bold indent-0.5 border-dashed outline-none"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Location"
        />
      </form>
      <Footer />
    </div>
  )
};