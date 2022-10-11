import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
 
export default function AdvancedWeather () {
  document.title = "Worther - Advanced Weather";

  const[ city, setCity ] = useState();
  const [ country, setCountry ] = useState();
  const options = useMemo(() => countryList().getData(), []);
  const [ countryCode, setCountryCode ] = useState('');

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    history('/weatherCountry/' + countryCode +'/'+ city);
  }

  return(
    <div className="text-center select-none bg-black text-white min-h-screen flex flex-col justify-center">
      <Header choice={'weather'}/>
      <p className='text-7xl mb-9 font-bold'>
        Advanced Current Weather
      </p>
      <form onSubmit={handleSubmit}>
        <Select 
            value = {country}
            onChange = {(val) => [setCountry(val), setCountryCode(val.value)]}
            options={options}
            className="rounded-md w-48 h-8 mx-auto mb-5 text-black"
            placeholder='Country'
        />
        <input
            className="rounded-md w-48 h-8 text-base font-bold indent-1.5 outline-none"
            type="text"
            id="weatherButtons"
            value={city}
            onChange={(e) => setCity(e.target.value.toUpperCase())}
            placeholder="City"
        />
        <button disabled={!country || !city} type="submit" className='rounded-md block w-16 h-6 mx-auto mt-3' id="weatherButtons">
            Search
        </button>
      </form>
      <a href='/weather' className='mt-3 underline'>Simple Search</a>
      <Footer />
    </div>
  )
};