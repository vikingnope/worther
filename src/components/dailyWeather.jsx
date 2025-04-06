import {useEffect, useState, useMemo, memo } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { WeatherIcons, WindDirection, VisibilityDesc, WindForce, TimeZoneShow, SunriseSunsetTimes, WindArrow } from './utils/weatherVariables';
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
    <div className='text-white overflow-hidden flex flex-col min-h-screen bg-gradient-to-b from-black via-blue-950 to-black'>
      <Header/>
      <div className="text-center text-white grow flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center relative my-8">
          <section className="mb-6">
            <button 
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium cursor-pointer group mb-4 sm:mb-0 sm:absolute sm:left-4 md:left-8 self-start mx-4 sm:mx-0"
              onClick={() => navigate(-1)}
              aria-label="Go back to the last page"
            >
              <FaArrowLeft className="h-5 w-5 mr-2 transform transition-transform duration-300 translate-x-1 group-hover:translate-x-0" />
              Back to Last Page
            </button>
          </section>
          <p className='text-4xl font-bold underline'>Daily Forecast Data {location.name?.trim() ? `- ${location.name}` : ''} </p>
        </div>
          <div className="xl:grid xl:grid-cols-1 gap-4 px-4 xl:px-8 w-full max-w-full pb-6">
            {(weather.length > 0) ?
              (
                <>
                <div className="hidden sm:flex sm:mb-4 sm:items-center sm:justify-center xl:hidden">
                  <div className="bg-blue-600/30 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <span className="animate-pulse">⟵</span>
                    <span className="mx-2">Scroll to view more days</span>
                    <span className="animate-pulse">⟶</span>
                  </div>
                </div>
                <div className="flex xl:grid xl:grid-flow-col xl:auto-cols-fr gap-6 w-full overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                  {weather.map((weather, index) => {
                    const dayConversion = localDayConversions[weather.date];

                    return (
                      <div 
                        key={index} 
                        className='flex flex-col duration-300 xl:border xl:border-blue-900/50 border-y border-blue-900/30 xl:rounded-xl text-white h-full xl:w-full min-w-[85%] sm:min-w-[60%] md:min-w-[45%] xl:min-w-0 xl:mx-0 mx-2 first:ml-4 last:mr-4 px-4 xl:px-6 py-4 xl:py-6 justify-between overflow-hidden break-words bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 backdrop-blur-sm xl:hover:bg-gradient-to-r xl:hover:from-slate-800 xl:hover:via-blue-950 xl:hover:to-slate-800 xl:hover:shadow-xl xl:hover:shadow-blue-900/20 transition-all xl:min-h-[900px] snap-center'
                        role="article" 
                        aria-label={`Weather forecast for ${dayConversion}`}
                      >
                        {/* Day header section */}
                        <div className="shrink-0 mx-auto mt-1 xl:mt-2 mb-3 xl:mb-6 text-center">
                          <p className='font-bold text-2xl xl:text-3xl block mb-1 xl:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 animate-text'>{dayConversion}</p>
                          <span className="inline-block h-1 w-24 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-400 mb-4 xl:mb-8"></span>
                        </div>

                        {/* Weather Icon - Moved to the middle */}
                        <div className="mb-6 xl:mb-8 relative flex justify-center">
                          <div className="absolute inset-0 bg-emerald-600/10 blur-xl rounded-full"></div>
                          <div className="relative transform hover:scale-110 transition-transform duration-300">
                            <div className="h-[120px] flex items-center justify-center">
                              <WeatherIcons 
                                mainWeather={weather.weather.main} 
                                windSpeed={weather.windSpeed} 
                                description={weather.weather.description} 
                                timeZone={times.timeZone} 
                                sunriseHour={localSunriseSunsetTimes?.sunriseHour} 
                                sunsetHour={localSunriseSunsetTimes?.sunsetHour} 
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Temperature section with highlight */}
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 xl:p-6 mb-4 xl:mb-8 shadow-inner border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                          <p className='mx-auto text-lg xl:text-xl mb-1 xl:mb-2 text-center'>
                            <span className="text-2xl xl:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                              {Math.round(weather.tempMin)}°C - {Math.round(weather.tempMax)}°C
                            </span>
                          </p>
                          <p className="text-gray-400 text-center text-xs xl:text-sm">Temperature Range</p>
                        </div>
                        
                        {/* Wind data section */}
                        <div className="flex flex-col mb-4 xl:mb-8 border-b border-gray-800/30 pb-3 xl:pb-6">
                          <h3 className="text-base xl:text-lg font-semibold mb-2 xl:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Wind Conditions</h3>
                          <div className="grid grid-cols-2 gap-2 xl:gap-3">
                            <div className="flex flex-col items-center justify-center text-center bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                              <p className='text-base xl:text-lg mb-0 xl:mb-1'>{weather.windSpeed.toFixed(2)} m/s</p>
                              <p className='text-yellow-400 text-xs xl:text-sm'>({<WindForce windSpeed={weather.windSpeed} />})</p>
                            </div>
                            <div className="text-center bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50 relative">
                              <div className="flex items-center justify-center mb-1">
                                <div className="h-10 w-10 rounded-full bg-gray-700/70 flex items-center justify-center mb-1 wind-arrow-container">
                                  <WindArrow degrees={weather.windDegrees} />
                                </div>
                              </div>
                              <p className='text-base xl:text-lg mb-0 xl:mb-1 flex items-center justify-center'>
                                {<WindDirection windDegrees={weather.windDegrees}/>} <span className='text-yellow-400 text-xs xl:text-sm ml-1'>@ {Math.round(weather.windDegrees)}°</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Other weather data section */}
                        <div className="grid grid-cols-2 gap-2 xl:gap-4 mb-4 xl:mb-8">
                          <div className="text-center bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                            <p className='text-base xl:text-lg mb-0 xl:mb-1'>{Math.round(weather.precipitation)}%</p>
                            <p className='text-xs xl:text-sm text-gray-400'>Precipitation</p>
                          </div>
                          <div className="text-center bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                            <p className='text-base xl:text-lg mb-0 xl:mb-1'>{Math.round(weather.humidity)}%</p>
                            <p className='text-xs xl:text-sm text-gray-400'>Humidity</p>
                          </div>
                          <div className="text-center col-span-2 bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                            <p className='text-base xl:text-lg mb-0 xl:mb-1'>
                              {(weather.visibility >= 1000) ?
                              (weather.visibility / 1000).toFixed(2) + ' km' :
                              weather.visibility + ' m'}
                            </p>
                            <p className='text-xs xl:text-sm text-blue-400'>({<VisibilityDesc visibility={weather.visibility}/>})</p>
                          </div>
                        </div>
                        
                        {/* Sunrise/Sunset section */}
                        <div className="flex flex-col mt-auto border-t border-gray-800/30 pt-3 xl:pt-6">
                          <h3 className="text-base xl:text-lg font-semibold mb-2 xl:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">Day & Night</h3>
                          <div className="grid grid-cols-2 gap-2 xl:gap-4">
                            <div className='text-center bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50'>
                              <BsFillSunriseFill size={24} className="inline text-orange-300 mb-1 xl:mb-2"/>
                              <p className='text-xs xl:text-sm text-gray-300 mb-0 xl:mb-1'>Sunrise</p>
                              <p className='text-sm xl:text-base font-medium'>
                                {localSunriseSunsetTimes ? 
                                  `${localSunriseSunsetTimes.sunriseHour > 23 
                                      ? String(localSunriseSunsetTimes.sunriseHour - 24).padStart(2, '0') 
                                      : String(localSunriseSunsetTimes.sunriseHour).padStart(2, '0')
                                    }:${String(localSunriseSunsetTimes.sunriseMinute).padStart(2, '0')}` 
                                  : 'N/A'} 
                              </p>
                            </div>
                            <div className='text-center bg-black/30 backdrop-blur-sm p-2 xl:p-4 rounded-lg border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50'>
                              <BsFillSunsetFill size={24} className="inline text-orange-400 mb-1 xl:mb-2"/>
                              <p className='text-xs xl:text-sm text-gray-300 mb-0 xl:mb-1'>Sunset</p>
                              <p className='text-sm xl:text-base font-medium'>
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
                            <p className='text-center text-xs mt-2 xl:mt-3 text-gray-400'>
                              Time Zone: <TimeZoneShow timeZone={times.timeZone}/>
                            </p>
                          )}
                        </div>
                    </div>
                  );
                })}
                </div>
                </>
              ) :
              <>
                {error ? (
                  <p className="text-white mx-auto font-bold text-xl" role="alert" aria-live="polite">{error}</p>
                ) : (
                  <div className="flex flex-grow items-center justify-center">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-blue-900/30 shadow-lg max-w-md w-full backdrop-blur-sm">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-16 w-16 rounded-full bg-blue-700/70 mb-5 animate-spin flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-blue-900/70"></div>
                        </div>
                        <div className="h-7 w-64 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md mb-4"></div>
                        <div className="h-5 w-48 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md"></div>
                        <p className="mt-5 text-gray-400 font-medium">Loading forecast data...</p>
                      </div>
                    </div>
                  </div>
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