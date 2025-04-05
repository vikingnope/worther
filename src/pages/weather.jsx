import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import { FaCity } from 'react-icons/fa';
import Select from 'react-select';
import countryList from 'react-select-country-list';
 
export default function Weather () {
  
  const options = useMemo(() => countryList().getData(), []);

  const [searchMode, setSearchMode] = useState('simple'); // 'simple' or 'advanced'
  document.title = searchMode === 'simple' ? "Worther - Weather" : "Worther - Advanced Weather";

  const[ city, setCity ] = useState('');
  const [userPos, setUserPos] = useState({latitude: undefined, longitude: undefined});
  const [country, setCountry] = useState();
  const [countryCode, setCountryCode] = useState('');

  const history = useNavigate();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    history('/weather/' + city);
  }, [history, city]);

  const handleAdvancedSubmit = useCallback((e) => {
    e.preventDefault();

    history('/weatherCountry/' + countryCode +'/'+ city);
  }, [history, countryCode, city]);

  const handleSubmitLocation = useCallback((e) => {
    e.preventDefault();

    history('/weatherLocation/' + userPos.latitude + '/' + userPos.longitude);
  }, [history, userPos.latitude, userPos.longitude]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error(`ERROR(${err.code}): ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const toggleSearchMode = useCallback(() => {
    setSearchMode(searchMode === 'simple' ? 'advanced' : 'simple');
    setCity('');
    setCountry(undefined);
    setCountryCode('');
  }, [searchMode]);

  return(
    <div className='text-white overflow-hidden bg-black flex flex-col min-h-screen'>
      <Header/>
      <div className="text-center grow flex flex-col justify-center items-center">
        <p className={`text-7xl mb-16 font-bold underline ${searchMode === 'simple' ? 'text-teal-500' : 'text-red-500'}`}>
          {searchMode === 'simple' ? 'Current Weather' : 'Advanced Current Weather'}
        </p>
        
        {searchMode === 'simple' ? (
          <form onSubmit={handleSubmit}>
            <div className='w-56 h-7.5 text-base font-bold border indent-1.5 outline-hidden rounded-md bg-weatherButtons'>
              <FaCity size='17' className='inline mr-1.5 mb-1'/>
              <input
                  className="rounded-r-md w-48 h-7 text-base font-bold indent-1.5 outline-hidden bg-weatherButtons"
                  type="text"
                  id="weatherButtons"
                  value={city}
                  onChange={(e) => setCity(e.target.value.toUpperCase())}
                  placeholder='Enter City'
              />
            </div>
            <button disabled={!city} type="submit" className='rounded-md block w-24 h-7 mt-3 border mx-auto bg-weatherButtons'>
              <BiSearchAlt size='22' className='inline mr-1.5 mb-0.5'/>
              Search
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdvancedSubmit}>
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
                  menu: () => "mt-1 rounded-xs border shadow-lg text-white bg-weatherButtons font-bold",
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
            <div className='w-56 h-9 text-base font-bold border indent-1.5 outline-hidden mx-auto rounded-md bg-weatherButtons'>
              <FaCity size='17' className='inline mr-1.5 mb-1'/>
              <input
                  className="rounded-r-md w-48 text-base font-bold indent-1.5 outline-hidden h-8 bg-weatherButtons"
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
        )}
        
        {searchMode === 'simple' && (userPos.latitude !== undefined && userPos.longitude !== undefined) && (
          <form onSubmit={handleSubmitLocation}>
            <button type="submit" className='rounded-md border block w-56 h-7 mt-3 bg-weatherButtons'>
              <IoLocationSharp size='22' className='inline mr-1.5 mb-0.5'/>
              Search with my location
            </button>
          </form>
        )}
        
        <button 
          onClick={toggleSearchMode} 
          className='mt-3 underline w-max cursor-pointer'
        >
          {searchMode === 'simple' ? 'Advanced Search' : 'Simple Search'}
        </button>
      </div>
      <Footer />
    </div>
  )
};