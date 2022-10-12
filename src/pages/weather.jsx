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
    <div className='select-none text-white'>
      <Header choice={'weather'}/>
      <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
        <p className='text-7xl mb-9 font-bold'>
          Current Weather
        </p>
        <form onSubmit={handleSubmit}>
          <input
              className="rounded-md w-48 h-7 text-base font-bold indent-1.5 outline-none"
              type="text"
              id="weatherButtons"
              value={city}
              onChange={(e) => setCity(e.target.value.toUpperCase())}
              placeholder="City"
          />
          <button disabled={!city} type="submit" className='rounded-md block w-16 h-6 mx-auto mt-3' id="weatherButtons">
              Search
          </button>
        </form>
        {
          (userPos.latitude !== undefined && userPos.longitude !== undefined) ?
            <form onSubmit={handleSubmitLocation}>
              <button type="submit" className='rounded-md block w-48 h-6 mx-auto mt-3' id="weatherButtons">
                  Search with my location
              </button>
            </form> :
            <></>
        }
        <a href='/advancedWeather' className='mt-3 underline'>Advanced Search</a>
      </div>
      <Footer />
    </div>
  )
};