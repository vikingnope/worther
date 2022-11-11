import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { FaCity } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
 
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
    <div className='select-none text-white'>
      <Header choice={'weather'}/>
      <div className="text-center bg-black min-h-screen flex flex-col justify-center">
        <p className='text-7xl mb-9 font-bold'>
          Advanced Current Weather
        </p>
        <form onSubmit={handleSubmit}>
          <Select 
              value = {country}
              onChange = {(val) => [setCountry(val), setCountryCode(val.value)]}
              options={options}
              className="rounded-md w-48 h-8 mx-auto mb-5 text-black"
              id="country"
              placeholder='Choose Country'
          />
          <div className='rounded-md w-56 h-7 text-base font-bold indent-1.5 outline-none mx-auto' id="weatherButtons">
            <FaCity size='17' className='inline mr-1.5 mb-1'/>
            <input
                className="rounded-md w-48 h-7 text-base font-bold indent-1.5 outline-none"
                type="text"
                id="weatherButtons"
                value={city}
                onChange={(e) => setCity(e.target.value.toUpperCase())}
                placeholder='Enter City'
            />
          </div>
          <button disabled={!country || !city} type="submit" className='rounded-md block w-24 h-6 mx-auto mt-3' id="weatherButtons">
            <BiSearchAlt size='22' className='inline mr-1.5 mb-px'/>
            Search
          </button>
        </form>
        <a href='/weather' className='mt-3 underline w-max mx-auto'>Simple Search</a>
      </div>
      <Footer />
    </div>
  )
};