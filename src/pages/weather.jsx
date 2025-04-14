import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import { FaCity } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
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
  const [geoError, setGeoError] = useState(null);

  const history = useNavigate();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    history('/weather/' + city.trim());
  }, [history, city]);

  const handleAdvancedSubmit = useCallback((e) => {
    e.preventDefault();

    history('/weatherCountry/' + countryCode +'/'+ city.trim());
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
          setGeoError(null);
        },
        (err) => {
          console.error(`ERROR(${err.code}): ${err.message}`);
          setGeoError({
            code: err.code,
            message: err.message
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setGeoError({
        code: 0,
        message: "Geolocation is not supported by this browser."
      });
    }
  }, []);

  const toggleSearchMode = useCallback(() => {
    setSearchMode(searchMode === 'simple' ? 'advanced' : 'simple');
    setCity('');
    setCountry(undefined);
    setCountryCode('');
  }, [searchMode]);

  // Helper function to get user-friendly error message
  const getGeoErrorMessage = (error) => {
    if (!error) return null;
    
    switch(error.code) {
      case 1:
        return "Location access was denied. Please enable location permissions in your browser settings to use this feature.";
      case 2:
        return "Unable to determine your current location. The signal might be weak or timed out.";
      case 3:
        return "Location request timed out. Please try again later.";
      default:
        return error.message || "An error occurred while trying to get your location.";
    }
  };

  return(
    <div className='text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black flex flex-col min-h-screen'>
      <Header/>
      <main className="grow flex flex-col items-center justify-center px-4 py-8">
        <section className="text-center mb-8 w-full max-w-lg">
          <h1 className={`text-5xl md:text-7xl mb-4 font-bold bg-clip-text text-transparent bg-gradient-to-r ${searchMode === 'simple' ? 'from-teal-400 to-blue-500' : 'from-red-400 to-purple-500'}`}>
            {searchMode === 'simple' ? 'Weather Search' : 'Advanced Search'}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {searchMode === 'simple' ? 'Find current conditions and forecasts for any city' : 'Specify country for more accurate results'}
          </p>
        
          <div className="bg-gradient-to-r from-gray-900 to-slate-900 rounded-xl shadow-lg p-6 border border-blue-900 hover:border-blue-700 transition-all duration-300">
            {searchMode === 'simple' ? (
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className='w-full max-w-xs relative group mb-4'>
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'>
                    <FaCity size='17' />
                  </div>
                  <input
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='Enter City'
                  />
                </div>
                <button 
                  disabled={!city} 
                  type="submit" 
                  className={`rounded-lg w-full max-w-xs py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all duration-300 ${!city ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'}`}
                >
                  <BiSearchAlt size='22' />
                  Search
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdvancedSubmit} className="flex flex-col items-center">
                <div className='w-full max-w-xs mb-4'>
                  <Select 
                    value={country}
                    onChange={(val) => [setCountry(val), setCountryCode(val.value)]}
                    options={options}
                    placeholder='Choose Country'
                    unstyled
                    styles={{
                      menu: (base) => ({
                        ...base,
                        width: '100%',
                        maxWidth: '20rem',
                        zIndex: 50
                      }),
                    }}
                    classNames={{
                      control: () => "bg-black/50 border border-gray-700 rounded-lg py-2 px-3 text-white w-full transition-all duration-300 hover:border-gray-500",
                      input: () => "text-white",
                      menu: () => "mt-1 rounded-lg border border-gray-700 shadow-lg bg-gray-900 text-white",
                      option: ({ isFocused, isSelected }) => 
                        `px-3 py-2 ${
                          isFocused ? 'bg-blue-900' : ''
                        } ${
                          isSelected ? 'bg-blue-700' : ''
                        } hover:bg-blue-800 transition-colors duration-150`,
                      placeholder: () => 'text-gray-400'
                    }}
                  />
                </div>
                <div className='w-full max-w-xs relative group mb-4'>
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'>
                    <FaCity size='17' />
                  </div>
                  <input
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='Enter City'
                  />
                </div>
                <button 
                  disabled={!country || !city} 
                  type="submit" 
                  className={`rounded-lg w-full max-w-xs py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all duration-300 ${!country || !city ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'}`}
                >
                  <BiSearchAlt size='22' />
                  Search
                </button>
              </form>
            )}
            
            {searchMode === 'simple' && (
              userPos.latitude !== undefined && userPos.longitude !== undefined ? (
                <form onSubmit={handleSubmitLocation} className="mt-4">
                  <button 
                    type="submit" 
                    className="w-full max-w-xs mx-auto rounded-lg py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 font-medium transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <IoLocationSharp size='22' />
                    Use My Current Location
                  </button>
                </form>
              ) : (
                geoError && (
                  <div className="mt-4 p-3 bg-gray-800/70 border border-orange-700 rounded-lg text-sm max-w-xs mx-auto">
                    <div className="flex items-start gap-2">
                      <MdErrorOutline className="text-orange-500 mt-0.5 flex-shrink-0" size="18" />
                      <div>
                        <p className="text-orange-300 font-semibold mb-1">Location unavailable</p>
                        <p className="text-gray-300">{getGeoErrorMessage(geoError)}</p>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
          
          <button 
            onClick={toggleSearchMode} 
            className="mt-6 text-blue-400 hover:text-blue-300 underline font-medium transition-colors duration-300"
          >
            {searchMode === 'simple' ? 'Switch to Advanced Search' : 'Switch to Simple Search'}
          </button>
        </section>
        
        <section className="w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-4 shadow-md">
              <h2 className="font-bold text-xl mb-2 text-blue-400">Weather Features</h2>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Current conditions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 5-day forecast
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Temperature, humidity, wind
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Precipitation chance
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-4 shadow-md">
              <h2 className="font-bold text-xl mb-2 text-blue-400">Search Tips</h2>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">→</span> 
                  <span>Use advanced search for cities with common names</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">→</span> 
                  <span>Location search provides the most accurate results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">→</span> 
                  <span>City names should be in English</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
};