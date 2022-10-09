import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
export default function Weather () {
  document.title = "Worther - Weather";

  const[ city, setCity ] = useState();

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
            className="rounded w-48 h-7 text-black text-base font-bold indent-0.5 outline-none"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value.toUpperCase())}
            placeholder="City"
        />
        <button type="submit" className='rounded block w-16 h-6 bg-white text-black mx-auto mt-3'>
            Search
        </button>
      </form>
      <a href='/advancedWeather' className='mt-3 underline'>Advanced Search</a>
      <Footer />
    </div>
  )
};