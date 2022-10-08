import { AiOutlineClose } from 'react-icons/ai';
import { GetOpenWeatherData } from "../components/openWeatherData"; 
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
export default function Weather () {
  document.title = "Worther - Weather";

  const[city, setCity] = useState();

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    history('/weather/' + city);
  }

  return(
    <div className="text-center select-none bg-black text-white min-h-screen flex flex-col justify-center">
      <Header choice={'weather'}/>
      <p className='text-7xl mb-9 font-bold'>
        Current Weather
      </p>
      <form onSubmit={handleSubmit}>
        <input
            className="rounded w-44 h-7 text-black text-base font-bold indent-0.5 border-dashed outline-none"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            placeholder="Location"
        />
      </form>
      <Footer />
    </div>
  )
};