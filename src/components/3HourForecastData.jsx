import {useEffect, useState, useMemo, useCallback, memo } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { TimeZoneShow, WeatherIcons, WindDirection, VisibilityDesc, WindForce, SunriseSunsetTimes, WindCompass } from './utils/weatherVariables';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import { FaArrowLeft } from "react-icons/fa6";

export const ThreeHourForecastData = memo(() => {
  const { lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ times, setTimes ] = useState([]);
  const isDesktopView = useDeviceDetect();
  const [ loading, setLoading ] = useState(true);

  const history = useNavigate();

  const handleNavigateBack = useCallback(() => {
    // Go back to single weather page with current location
    if (location.lat && location.lon) {
      history(`/weatherLocation/${location.lat}/${location.lon}`);
    } else {
      // Fallback to history back if location coordinates are not available
      history(-1);
    }
  }, [history, location.lat, location.lon]);

  const handleSubmit = useCallback((e, index) => {
    e.preventDefault();

    history('/Single3HourForecast/' + index + '/' + location.lat + '/' + location.lon);
  }, [history, location.lat, location.lon]);

  useEffect(() => {
    document.title = "Worther - 3 Hour Weather - " + (location.name || "");
  }, [location.name]);

  useEffect(() => {
    if (!loading) return;
    
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}&units=metric`
        );
        
        // Process all weather data at once instead of updating state in a loop
        const weatherData = response.data.list.map(weatherAPI => ({
          humidity: weatherAPI.main.humidity,
          temperature: weatherAPI.main.temp,
          tempFeel: weatherAPI.main.feels_like,
          pressure: weatherAPI.main.pressure,
          mainWeather: weatherAPI.weather[0].main,
          description: weatherAPI.weather[0].description,
          windSpeed: weatherAPI.wind.speed,
          windDegrees: weatherAPI.wind.deg,
          precipitation: (weatherAPI.pop * 100),
          visibility: weatherAPI.visibility,
          dayUNIX: ((weatherAPI.dt) * 1000),
          timeNormalHour: String((new Date((weatherAPI.dt) * 1000)).getHours()).padStart(2, '0'),
          timeNormalMinutes: String((new Date((weatherAPI.dt) * 1000)).getMinutes()).padStart(2, '0')
        }));
        
        // Set all weather data in a single update
        setWeather(weatherData);
        
        setLocation({
          name: response.data.city.name,
          country: response.data.city.country,
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon,
          timeZone: response.data.city.timezone
        });
        
        setTimes({
          sunrise: response.data.city.sunrise,
          sunset: response.data.city.sunset,
          timeZone: response.data.city.timezone
        });
        
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [lat, lon, loading]);

  // Group weather data by day using useMemo for better performance
  const groupedWeatherByDay = useMemo(() => {
    const grouped = {};
    
    weather.forEach((item, index) => {
      const day = new Date((item.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({ ...item, index });
    });
    
    return grouped;
  }, [weather, location.timeZone]); // Only recalculate when these dependencies change

  const localSunriseSunsetTimes = useMemo(() => {
    if (times?.sunrise && times?.sunset && times?.timeZone !== undefined) {
      return SunriseSunsetTimes(times);
    }
    return null;
  }, [times]);

  return (
    <div className='text-white overflow-hidden flex flex-col min-h-screen bg-gradient-to-b from-black via-blue-950 to-black'>
      <Header/>
      <div className="text-center text-white grow flex flex-col px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center relative my-8">
            <section className="mb-6">
              <button 
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium cursor-pointer group mb-4 sm:mb-0 sm:absolute sm:left-4 self-start mx-4 sm:mx-0"
                onClick={handleNavigateBack}
                aria-label="Go back to the weather page"
              >
                <FaArrowLeft className="h-5 w-5 mr-2 transform transition-transform duration-300 translate-x-1 group-hover:translate-x-0" />
                Back to Weather
              </button>
            </section>
            <p className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 lg:text-4xl animate-text tracking-tight'>{location.name ? `3 Hour Forecast - ${location.name}` : "Loading..."}</p>
          </div>
          {(weather.length > 0) ? (
            Object.entries(groupedWeatherByDay).map(([day, dayWeather]) => (
              <div key={day} className="mb-10">
                <h2 className="text-3xl font-bold py-3 rounded-t-lg bg-gradient-to-r from-gray-900 to-slate-900 border-b border-blue-900 text-blue-400">{day}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {dayWeather.map((weather) => {
                  const hourConversion = Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600);
                  return (
                    <button
                      aria-label={`Weather forecast for ${day} at ${(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:${weather.timeNormalMinutes}, ${weather.description}`}
                      key={weather.index} 
                      onClick={(e) => handleSubmit(e, weather.index)} 
                      className='bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-700 shadow-md hover:shadow-cyan-900/30 transition-all duration-300 hover:-translate-y-1 rounded-lg flex flex-col text-white p-4 cursor-pointer h-full'
                    >
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700">
                        <div className='font-bold text-xl text-cyan-300'>
                          {(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:{weather.timeNormalMinutes}
                          <div className="text-sm font-normal text-gray-400">
                            (<TimeZoneShow timeZone={location.timeZone}/>)
                          </div>
                        </div>
                        <div className="flex items-center justify-center h-[70px] w-[70px]">
                          <WeatherIcons 
                            mainWeather={weather.mainWeather} 
                            windSpeed={weather.windSpeed} 
                            description={weather.description} 
                            timeZone={times.timeZone} 
                            sunriseHour={localSunriseSunsetTimes?.sunriseHour} 
                            sunsetHour={localSunriseSunsetTimes?.sunsetHour} 
                            hourConversion={hourConversion} 
                            page={isDesktopView ? 'multiple' : 'multiple-mobile'}
                          />
                        </div>
                      </div>

                      <div className='font-bold text-lg text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500'>
                        {weather.description.toUpperCase()}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm mt-auto">
                        <div className='flex items-center'>
                          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                          <span>Temp: <span className="font-semibold">{Math.round(weather.temperature)}°C</span></span>
                        </div>
                        
                        <div className='flex items-center'>
                          <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                          <span>Precip: <span className="font-semibold">{Math.round(weather.precipitation)}%</span></span>
                        </div>
                        
                        <div className='flex items-center'>
                          <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                          <span>Vis: <span className="font-semibold">{(weather.visibility >= 1000) ?
                            (weather.visibility / 1000) + 'km' :
                            (weather.visibility) + 'm'}</span>
                          </span>
                        </div>
                        
                        <div className='flex items-center'>
                          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                          <span>Wind: <span className="font-semibold">{weather.windSpeed} m/s</span></span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-center">
                        <WindCompass degrees={weather.windDegrees} />
                        <span className="ml-3 text-sm">
                          <span className="block text-gray-400">Wind direction</span>
                          <span>{<WindDirection windDegrees={weather.windDegrees}/>} @ {weather.windDegrees}°</span>
                          <span className="block text-xs text-gray-400">({<WindForce windSpeed={weather.windSpeed} />})</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-grow items-center justify-center">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-700 mb-4"></div>
                  <div className="h-6 w-48 bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 w-32 bg-gray-700 rounded"></div>
                  <p className="mt-4 text-gray-400">Loading forecast data...</p>
                </div>
              </div>
            </div>
          )}
      </div>
      <Footer />
    </div>
  )
});

ThreeHourForecastData.displayName = 'ThreeHourForecastData';