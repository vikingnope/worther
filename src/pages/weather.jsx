import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
export default function Weather () {
  document.title = "Worther - Weather";

  const[ city, setCity ] = useState();
  const [userPos, setUserPos] = useState({latitude: undefined, longitude: undefined});

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    history('/weather/' + city);
  }

  const handleSubmitLocation = (e) => {
    e.preventDefault();

    history('/weatherLocation/' + userPos.latitude + '/' + userPos.longitude);
  }

  useEffect(() => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos) =>{
            const newUserPos = { 
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
             };
            setUserPos(newUserPos);
       })
    }
  }, []);

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
        <button disabled={!city} type="submit" className='rounded block w-16 h-6 bg-white text-black mx-auto mt-3'>
            Search
        </button>
      </form>
      {
        (userPos.latitude !== undefined && userPos.longitude !== undefined) ?
          <form onSubmit={handleSubmitLocation}>
            <button type="submit" className='rounded block w-44 h-6 bg-white text-black mx-auto mt-3'>
                Search with my location
            </button>
          </form> :
          <></>
      }
      <a href='/advancedWeather' className='mt-3 underline'>Advanced Search</a>
      <Footer />
    </div>
  )
};