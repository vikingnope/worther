import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { WeatherIcons, WindDirection, VisibilityDesc, WindForce, TimeZoneShow } from './utils/weatherVariables';
import { BsFillSunriseFill, BsFillSunsetFill } from 'react-icons/bs';

export const DailyWeatherData = () => {
  const { lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ times, setTimes ] = useState([]);
  const [error, setError] = useState(null);

  document.title = "Worther - Daily Weather - " + location.name;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`)    
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
            precipitation: 0,
            humidity: 0,
            visibility: 0,
            windSpeed: 0,
            windDegrees: 0,
            tempMin: weatherAPI.main.temp,
            tempMax: weatherAPI.main.temp,
            count: 0,
            weather: weatherAPI.weather[0]
          };
        }
        dailyData[date].precipitation += weatherAPI.pop * 100;
        dailyData[date].humidity += weatherAPI.main.humidity;
        dailyData[date].visibility += weatherAPI.visibility;
        dailyData[date].windSpeed += weatherAPI.wind.speed;
        dailyData[date].windDegrees += weatherAPI.wind.deg;
        dailyData[date].tempMin = Math.min(dailyData[date].tempMin, weatherAPI.main.temp_min);
        dailyData[date].tempMax = Math.max(dailyData[date].tempMax, weatherAPI.main.temp_max);
        dailyData[date].count += 1;
      }

      const weatherArray = Object.keys(dailyData).map(date => {
        const data = dailyData[date];
        return {
          date,
          precipitation: data.precipitation / data.count,
          humidity: data.humidity / data.count,
          visibility: data.visibility / data.count,
          windSpeed: data.windSpeed / data.count,
          windDegrees: data.windDegrees / data.count,
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
      console.log(error);
      console.error('Weather data fetch error:', error);
      if (error.response?.status === 429) {
        // Rate limit exceeded
        setError('Too many requests. Please try again later.');
      } else if (error.response?.status === 401) {
        // API key issues
        setError('Authentication error. Please check your API configuration.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    })
  }, [lat, lon]);

  let hourConversion = '';
  let dayConversion = '';

  // Convert sunrise/sunset times considering timezone
  const sunriseTime = new Date((times.sunrise * 1000) + (times.timeZone * 1000) + (new Date().getTimezoneOffset() * 60 * 1000));
  const sunsetTime = new Date((times.sunset * 1000) + (times.timeZone * 1000) + (new Date().getTimezoneOffset() * 60 * 1000));

  const sunriseHourConversion = sunriseTime.getHours();
  const sunriseMinuteConversion = sunriseTime.getMinutes();
  const sunsetHourConversion = sunsetTime.getHours();
  const sunsetMinuteConversion = sunsetTime.getMinutes();

  return (
    <div className='text-white overflow-hidden flex flex-col min-h-screen bg-black'>
      <Header/>
      <div className="text-center text-white flex-grow flex flex-col">
          <p className='text-4xl font-bold my-5 underline'>Daily Forecast Data {(location.name && location.name.trim()) ? `- ${location.name}` : ` `} </p>
          <div className="lg:flex lg:flex-row my-auto">
            {(weather.length > 0) ?
              (
                weather.map((weather, index) => (
                  dayConversion = (
                    new Date((new Date(weather.date).getTime() + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString()
                  ),
                  [
                    <div key={index} className='flex flex-col duration-300 lg:border-2 border-y-2 lg:rounded-xl text-white h-fit lg:w-80 w-full lg:m-auto mx-auto'>
                        <p className="mx-auto mt-10">
                          <WeatherIcons mainWeather={weather.weather.main} windSpeed={weather.windSpeed} description={weather.weather.description} timeZone={times.timeZone} sunriseHour={sunriseHourConversion} sunsetHour={sunsetHourConversion} hourConversion={hourConversion} page={'daily'}/>
                        </p>
                        <p className='mx-auto lg:mt-10 mt-5 font-bold text-2xl block underline'>{dayConversion}</p>
                        <p className='mx-auto lg:mt-10 mt-5 font-bold text-2xl block'>{weather.weather.description.toUpperCase()}</p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>Temp: {Math.round(weather.tempMin)}°C - {Math.round(weather.tempMax)}°C</p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>Wind Speed: {weather.windSpeed.toFixed(2)} m/s ({<WindForce windSpeed={weather.windSpeed} />})</p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>Wind Direction: {<WindDirection windDegrees={weather.windDegrees}/>} @ {Math.round(weather.windDegrees)}°</p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>Precipitation: {weather.precipitation.toFixed(2)}%</p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>Humidity: {weather.humidity.toFixed(2)}%</p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>Visibility: {(weather.visibility >= 1000) ?
                        (weather.visibility / 1000).toFixed(2) + 'km' :
                        weather.visibility + 'm'} ({<VisibilityDesc visibility={weather.visibility}/>})
                        </p>
                        <p className='mx-auto lg:mt-10 mt-5 text-xl block'>{<BsFillSunriseFill size={40} className="inline mr-2"/>}Sunrise: {(sunriseHourConversion > 23) ? String(sunriseHourConversion - 24).padStart(2, '0') : String(sunriseHourConversion).padStart(2, '0')}:{String(sunriseMinuteConversion).padStart(2, '0')} ({<TimeZoneShow timeZone={times.timeZone}/>})</p>
                        <p className='mx-auto lg:my-10 my-5 text-xl block'>{<BsFillSunsetFill size={40} className="inline mr-2"/>}Sunset: {(sunsetHourConversion < 0) ? (sunsetHourConversion + 24) : sunsetHourConversion}:{String(sunsetMinuteConversion).padStart(2, '0')} ({<TimeZoneShow timeZone={times.timeZone}/>})</p>
                    </div> 
                  ]
                ))
              ) :
              <>
                {error ? <p className="text-white mx-auto font-bold text-xl">{error}</p> : <p className="text-white mx-auto font-bold text-xl">Loading...</p>}
              </>
            }
          </div>
          <button className="rounded-md h-8 text-xl my-16 font-bold w-24 mx-auto border" onClick={() => window.history.back()}>Go Back</button>
      </div>
      <Footer />
    </div>
  )
}