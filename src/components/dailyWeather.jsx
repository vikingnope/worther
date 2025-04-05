import {useEffect, useState, useMemo, memo } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { WeatherIcons, WindDirection, VisibilityDesc, WindForce, TimeZoneShow, SunriseSunsetTimes } from './utils/weatherVariables';
import { BsFillSunriseFill, BsFillSunsetFill } from 'react-icons/bs';
import { FaArrowLeft } from "react-icons/fa6";

export const DailyWeatherData = memo(() => {
  const { lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ times, setTimes ] = useState([]);
  const [ error, setError ] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Worther - Daily Weather - " + (location.name || "");
  }, [location.name]);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}&units=metric`)    
    .then(response => {
      const locationObj = {
        name: response.data.city.name,
        country: response.data.city.country,
        lat: response.data.city.coord.lat,
        lon: response.data.city.coord.lon,
        timeZone: response.data.city.timezone
      }
      setLocation(locationObj);

      const dailyData = {};

      for (const weatherAPI of response.data.list) {
        const date = new Date(weatherAPI.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = {
            precipitation: weatherAPI.pop * 100,
            humidity: 0,
            visibility: 0,
            windSpeed: 0,
            windSin: 0,
            windCos: 0,
            tempMin: weatherAPI.main.temp,
            tempMax: weatherAPI.main.temp,
            count: 0,
            weather: weatherAPI.weather[0]
          };
        } else {
          dailyData[date].precipitation = Math.max(dailyData[date].precipitation, weatherAPI.pop * 100);
        }
        dailyData[date].humidity += weatherAPI.main.humidity;
        dailyData[date].visibility += weatherAPI.visibility;
        dailyData[date].windSpeed += weatherAPI.wind.speed;
        const windRad = (weatherAPI.wind.deg * Math.PI) / 180;
        dailyData[date].windCos += Math.cos(windRad);
        dailyData[date].windSin += Math.sin(windRad);
        dailyData[date].tempMin = Math.min(dailyData[date].tempMin, weatherAPI.main.temp_min);
        dailyData[date].tempMax = Math.max(dailyData[date].tempMax, weatherAPI.main.temp_max);
        dailyData[date].count += 1;
      }

      const weatherArray = Object.keys(dailyData).map(date => {
        const data = dailyData[date];
        return {
          date,
          precipitation: data.precipitation,
          humidity: Number((data.humidity / data.count).toFixed(2)),
          visibility: Number((data.visibility / data.count).toFixed(2)),
          windSpeed: Number((data.windSpeed / data.count).toFixed(2)),
          windDegrees: ((Math.atan2(data.windSin, data.windCos) * 180) / Math.PI + 360) % 360,
          tempMin: data.tempMin,
          tempMax: data.tempMax,
          weather: data.weather
        };
      });

      setWeather(weatherArray);

      const timesObj = {
        sunrise: response.data.city.sunrise,
        sunset: response.data.city.sunset,
        timeZone: response.data.city.timezone
      }
      setTimes(timesObj)
    })
    .catch(error => {
      if (import.meta.env.MODE !== 'production') {
        console.error('Weather data fetch error:', error);
      }
      if (error.response?.status === 429) {
        // Rate limit exceeded
        setError('Too many requests. Rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 401) {
        // API key issues
        setError(<>Authentication error. Please <a href="https://github.com/vikingnope/worther/issues/new?template=bug_report.md" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="text-blue-400 underline hover:text-blue-300">open an issue on GitHub</a> stating this error.</>);
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    })
  }, [lat, lon]);

  const localSunriseSunsetTimes = useMemo(() => {
    if (times?.sunrise && times?.sunset && times?.timeZone !== undefined) {
      return SunriseSunsetTimes(times);
    }
    return null;
  }, [times]);

  const localDayConversions = useMemo(() => {
    if (!weather.length || !location.timeZone) return {};
    
    return weather.reduce((acc, item) => {
      acc[item.date] = new Date(
        (new Date(item.date).getTime() + (location.timeZone * 1000)) + 
        ((new Date().getTimezoneOffset() * 60) * 1000)
      ).toDateString();
      return acc;
    }, {});
  }, [weather, location.timeZone]);

  return (
    <div className='text-white overflow-hidden flex flex-col min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950'>
      <Header/>
      <div className="text-center text-white flex-grow flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center relative my-8">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white hover:text-blue-500 transition-colors duration-300 group mb-4 sm:mb-0 sm:absolute sm:left-4 md:left-8 flex items-center self-start mx-4 sm:mx-0"
            aria-label="Go back to previous page"
          >
            <FaArrowLeft className="mr-2 transform transition-transform duration-300 translate-x-1 group-hover:translate-x-0" />
            <span className="font-medium">Back</span>
          </button>
          <p className='text-4xl font-bold underline'>Daily Forecast Data {location.name?.trim() ? `- ${location.name}` : ''} </p>
        </div>
          <div className="lg:grid lg:grid-cols-1 gap-4 px-4 lg:px-8 w-full max-w-full overflow-x-auto pb-6">
            {(weather.length > 0) ?
              (
                <div className="lg:grid lg:grid-flow-col lg:auto-cols-fr gap-6 w-full">
                {weather.map((weather, index) => {
                  const dayConversion = localDayConversions[weather.date];

                  return (
                    <div 
                      key={index} 
                      className='flex flex-col duration-300 lg:border-2 border-y-2 lg:rounded-xl text-white h-full w-full lg:mx-0 mx-auto px-6 py-6 justify-between overflow-hidden break-words bg-neutral-900 lg:hover:bg-neutral-700 lg:hover:shadow-xl lg:hover:shadow-slate-700/20 transition-all lg:min-h-[900px]'
                      role="article" 
                      aria-label={`Weather forecast for ${dayConversion}`}
                    >
                        {/* Day header section */}
                        <div className="flex-shrink-0 mx-auto mt-2 mb-6 text-center">
                          <p className='font-bold text-3xl block underline mb-2 text-blue-500'>{dayConversion}</p>
                          <span className="inline-block h-1 w-24 rounded bg-blue-500 mb-8"></span>
                          <div className="mb-6">
                            <WeatherIcons 
                              mainWeather={weather.weather.main} 
                              windSpeed={weather.windSpeed} 
                              description={weather.weather.description} 
                              timeZone={times.timeZone} 
                              sunriseHour={localSunriseSunsetTimes?.sunriseHour} 
                              sunsetHour={localSunriseSunsetTimes?.sunsetHour} 
                              page={'daily'}
                            />
                          </div>
                          <p className='mx-auto font-bold text-xl block text-yellow-400 mb-6'>{weather.weather.description.toUpperCase()}</p>
                        </div>
                        
                        {/* Temperature section with highlight */}
                        <div className="bg-neutral-800 rounded-lg p-6 mb-8 shadow-inner">
                          <p className='mx-auto text-xl mb-2 text-center'>
                            <span className="text-3xl font-semibold">
                              {Math.round(weather.tempMin)}°C - {Math.round(weather.tempMax)}°C
                            </span>
                          </p>
                          <p className="text-gray-400 text-center text-sm">Temperature Range</p>
                        </div>
                        
                        {/* Wind data section */}
                        <div className="flex flex-col mb-8 border-b border-neutral-800 pb-6">
                          <h3 className="text-lg font-semibold mb-4 text-gray-300">Wind Conditions</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center bg-neutral-800 p-4 rounded-lg">
                              <p className='text-lg mb-1'>{weather.windSpeed.toFixed(2)} m/s</p>
                              <p className='text-yellow-400 text-sm'>({<WindForce windSpeed={weather.windSpeed} />})</p>
                            </div>
                            <div className="text-center bg-neutral-800 p-4 rounded-lg">
                              <p className='text-lg mb-1'>{<WindDirection windDegrees={weather.windDegrees}/>}</p>
                              <p className='text-yellow-400 text-sm'>@ {Math.round(weather.windDegrees)}°</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Other weather data section */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="text-center bg-neutral-800 p-4 rounded-lg">
                            <p className='text-lg mb-1'>{Math.round(weather.precipitation)}%</p>
                            <p className='text-sm text-gray-400'>Precipitation</p>
                          </div>
                          <div className="text-center bg-neutral-800 p-4 rounded-lg">
                            <p className='text-lg mb-1'>{Math.round(weather.humidity)}%</p>
                            <p className='text-sm text-gray-400'>Humidity</p>
                          </div>
                          <div className="text-center col-span-2 bg-neutral-800 p-4 rounded-lg">
                            <p className='text-lg mb-1'>
                              {(weather.visibility >= 1000) ?
                              (weather.visibility / 1000).toFixed(2) + ' km' :
                              weather.visibility + ' m'}
                            </p>
                            <p className='text-sm text-blue-400'>({<VisibilityDesc visibility={weather.visibility}/>})</p>
                          </div>
                        </div>
                        
                        {/* Sunrise/Sunset section */}
                        <div className="flex flex-col mt-auto border-t border-neutral-800 pt-6">
                          <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">Day & Night</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className='text-center bg-neutral-800 p-4 rounded-lg'>
                              <BsFillSunriseFill size={28} className="inline text-orange-300 mb-2"/>
                              <p className='text-sm text-gray-300 mb-1'>Sunrise</p>
                              <p className='text-base font-medium'>
                                {localSunriseSunsetTimes ? 
                                  `${localSunriseSunsetTimes.sunriseHour > 23 
                                      ? String(localSunriseSunsetTimes.sunriseHour - 24).padStart(2, '0') 
                                      : String(localSunriseSunsetTimes.sunriseHour).padStart(2, '0')
                                    }:${String(localSunriseSunsetTimes.sunriseMinute).padStart(2, '0')}` 
                                  : 'N/A'} 
                              </p>
                            </div>
                            <div className='text-center bg-neutral-800 p-4 rounded-lg'>
                              <BsFillSunsetFill size={28} className="inline text-orange-400 mb-2"/>
                              <p className='text-sm text-gray-300 mb-1'>Sunset</p>
                              <p className='text-base font-medium'>
                                {localSunriseSunsetTimes ? 
                                  `${localSunriseSunsetTimes.sunsetHour < 0 
                                      ? String(localSunriseSunsetTimes.sunsetHour + 24).padStart(2, '0') 
                                      : String(localSunriseSunsetTimes.sunsetHour).padStart(2, '0')
                                    }:${String(localSunriseSunsetTimes.sunsetMinute).padStart(2, '0')}` 
                                  : 'N/A'} 
                              </p>
                            </div>
                          </div>
                          {times.timeZone !== undefined && (
                            <p className='text-center text-xs mt-3 text-gray-400'>
                              Time Zone: <TimeZoneShow timeZone={times.timeZone}/>
                            </p>
                          )}
                        </div>
                    </div>
                  );
                })}
                </div>
              ) :
              <>
                {error ? (
                  <p className="text-white mx-auto font-bold text-xl" role="alert" aria-live="polite">{error}</p>
                ) : (
                  <p className="text-white mx-auto font-bold text-xl" role="status" aria-live="polite">Loading...</p>
                )}
              </>
            }
          </div>
      </div>
      <Footer />
    </div>
  )
});

DailyWeatherData.displayName = 'DailyWeatherData';