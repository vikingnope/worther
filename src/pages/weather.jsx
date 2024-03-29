import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import { FaCity } from 'react-icons/fa';
 
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
        <p className='text-7xl mb-16 font-bold text-teal-500 underline'>
          Current Weather
        </p>
        <form onSubmit={handleSubmit}>
          <div className='w-56 h-7.5 text-base font-bold border indent-1.5 outline-none mx-auto rounded-md' id="weatherButtons">
            <FaCity size='17' className='inline mr-1.5 mb-0.5'/>
            <input
                className="rounded-r-md w-48 h-7 text-base font-bold indent-1.5 outline-none"
                type="text"
                id="weatherButtons"
                value={city}
                onChange={(e) => setCity(e.target.value.toUpperCase())}
                placeholder='Enter City'
            />
          </div>
          <button disabled={!city} type="submit" className='rounded-md block w-24 h-7 mx-auto mt-3 border' id="weatherButtons">
            <BiSearchAlt size='22' className='inline mr-1.5 mb-px'/>
            Search
          </button>
        </form>
        {
          (userPos.latitude !== undefined && userPos.longitude !== undefined) ?
            <form onSubmit={handleSubmitLocation}>
              <button type="submit" className='rounded-md border block w-56 h-7 mx-auto mt-3' id="weatherButtons">
                <IoLocationSharp size='22' className='inline mr-1.5 mb-px'/>
                Search with my location
              </button>
            </form> :
            <></>
        }
        <a href='/advancedWeather' className='mt-3 underline w-max mx-auto'>Advanced Search</a>
      </div>
      <Footer />
    </div>
  )
};