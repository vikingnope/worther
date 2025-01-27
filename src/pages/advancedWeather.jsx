import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { FaCity } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';

const options = countryList().getData();
 
export default function AdvancedWeather () {
  document.title = "Worther - Advanced Weather";

  const[ city, setCity ] = useState();
  const [ country, setCountry ] = useState();
  const [ countryCode, setCountryCode ] = useState('');

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    history('/weatherCountry/' + countryCode +'/'+ city);
  }

  return(
    <div className='text-white overflow-hidden'>
      <Header choice={'weather'}/>
      <div className="text-center bg-black min-h-screen flex flex-col justify-center">
        <p className='text-7xl mb-16 font-bold underline text-red-500'>
          Advanced Current Weather
        </p>
        <form onSubmit={handleSubmit}>
          <Select 
            value={country}
            onChange={(val) => [setCountry(val), setCountryCode(val.value)]}
            options={options}
            unstyled
            styles={{
              menu: (base) => ({
                  ...base,
                  width: '14rem',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)'
              }),
            }}
            classNames={{
                control: () => "border rounded-md w-56 h-9 px-2 mx-auto mb-5 text-white bg-weatherButtons font-bold",
                input: () => "text-white font-bold",
                menu: () => "mt-1 rounded-sm border shadow-lg text-white bg-weatherButtons font-bold",
                option: ({ isFocused, isSelected }) => 
                    `px-3 py-2 ${
                        isFocused ? 'bg-[#363740] text-white' : 'bg-weatherButtons text-white'
                    } ${
                        isSelected ? 'bg-[#3e404a] text-white' : ''
                    }`,
                placeholder: () => 'text-gray-400 font-bold'
            }}
            id="country"
            placeholder='Choose Country'
          />
          <div className='w-56 h-9 text-base font-bold border indent-1.5 outline-none mx-auto rounded-md bg-weatherButtons'>
            <FaCity size='17' className='inline mr-1.5 mb-1'/>
            <input
                className="rounded-r-md w-48 text-base font-bold indent-1.5 outline-none h-8 bg-weatherButtons"
                type="text"
                id="weatherButtons"
                value={city}
                onChange={(e) => setCity(e.target.value.toUpperCase())}
                placeholder='Enter City'
            />
          </div>
          <button disabled={!country || !city} type="submit" className='rounded-md border block w-24 h-7 mx-auto mt-3 bg-weatherButtons'>
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