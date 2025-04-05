import {useEffect, useState, useMemo, useCallback, memo } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { TimeZoneShow, WeatherIcons, WindDirection, VisibilityDesc, WindForce, SunriseSunsetTimes } from './utils/weatherVariables';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

export const ThreeHourForecastData = memo(() => {
  const { lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ times, setTimes ] = useState([]);
  const isDesktopView = useDeviceDetect();
  const [ loading, setLoading ] = useState(true);

  const history = useNavigate();

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
      <div className="text-center text-white grow flex flex-col px-4 md:px-6 lg:px-8">
          <p className='text-3xl font-bold my-5 bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 lg:text-4xl animate-text tracking-tight'>{location.name ? `3 Hour Forecast - ${location.name}` : "Loading..."}</p>
          {(weather.length > 0) ? (
            Object.entries(groupedWeatherByDay).map(([day, dayWeather]) => (
              <div key={day} className="mb-6">
                <h2 className="text-3xl font-bold py-3 rounded-t-lg bg-gradient-to-r from-gray-900 to-slate-900 border-b border-blue-900 text-blue-400">{day}</h2>
                <div className="grid grid-cols-1 gap-2 md:gap-3 mt-2">
                {dayWeather.map((weather) => {
                  const hourConversion = Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600);
                  return (
                    <button
                      aria-label={`Weather forecast for ${day} at ${(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:${weather.timeNormalMinutes}, ${weather.description}`}
                      key={weather.index} 
                      onClick={(e) => handleSubmit(e, weather.index)} 
                      className='bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-700 shadow-md hover:shadow-cyan-900/30 transition-all duration-300 hover:-translate-y-1 rounded-lg lg:grid lg:grid-cols-7 lg:gap-2 lg:items-center flex flex-col text-white p-3 md:p-4 cursor-pointer'
                    >
                      <div className="lg:justify-self-center mx-auto">
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
                      <div className='font-bold text-xl mx-auto lg:justify-self-center text-cyan-300'>
                        {(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:{weather.timeNormalMinutes}
                        <div className="text-base mt-1">
                          (<TimeZoneShow timeZone={location.timeZone}/>)
                        </div>
                      </div>
                      <div className='font-bold text-2xl mx-auto lg:justify-self-center mt-3 lg:mt-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500'>
                        {weather.description.toUpperCase()}
                      </div>
                      <div className='text-xl mx-auto lg:justify-self-center mt-3 lg:mt-0'>
                        Temp: <span className="font-semibold text-yellow-400">{Math.round(weather.temperature)}°C</span>
                      </div>
                      <div className='text-xl mx-auto lg:justify-self-center mt-3 lg:mt-0'>
                        Wind Speed: <span className="font-semibold text-green-400">{weather.windSpeed} m/s</span> ({<WindForce windSpeed={weather.windSpeed} />})
                        <div className="lg:mt-1 lg:pl-2">Direction: {<WindDirection windDegrees={weather.windDegrees}/>} @ {weather.windDegrees}°</div>
                      </div>
                      <div className='text-xl mx-auto lg:justify-self-center mt-3 lg:mt-0'>
                        Precipitation: <span className="font-semibold text-blue-400">{Math.round(weather.precipitation)}%</span>
                      </div>
                      <div className='text-xl mx-auto lg:justify-self-center mt-3 lg:mt-0 mb-3 lg:mb-0'>
                        Visibility: <span className="font-semibold">{(weather.visibility >= 1000) ?
                          (weather.visibility / 1000) + 'km' :
                          (weather.visibility) + 'm'}</span> ({<VisibilityDesc visibility={weather.visibility}/>})
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