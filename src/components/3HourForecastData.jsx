import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { TimeZoneShow, WeatherIcons, WindDirection, VisibilityDesc, WindForce } from './utils/weatherVariables';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

export const ThreeHourForecastData = () => {
  const { lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ times, setTimes ] = useState([]);
  const isDesktopView = useDeviceDetect();

  const history = useNavigate();

  const handleSubmit = (e, index) => {
    e.preventDefault();

    history('/Single3HourForecast/' + index + '/' + location.lat + '/' + location.lon);
  }

  document.title = "Worther - 3 Hour Weather - " + location.name;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`)    
    .then(response => {
      for (const weatherAPI of response.data.list) {
        if(weather.length < 40) {
          const weatherObj = {
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
            timeNormalHour: String((new Date((weatherAPI.dt) * 1000)).getHours()).padStart(2, '0'), // * padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
            timeNormalMinutes: String((new Date((weatherAPI.dt) * 1000)).getMinutes()).padStart(2, '0')
          }
          setWeather(weather => [...weather, weatherObj])
        }
      }

      const locationObj = {
        name: response.data.city.name,
        country: response.data.city.country,
        lat: response.data.city.coord.lat,
        lon: response.data.city.coord.lon,
        timeZone: response.data.city.timezone
      }
      setLocation(locationObj)

      const timesObj = {
        sunrise: response.data.city.sunrise,
        sunset: response.data.city.sunset,
        timeZone: response.data.city.timezone
      }
      setTimes(timesObj)
    })
    .catch(error => {
      console.log(error);
    })
  }, [lat, lon, weather.length]);

  let hourConversion = '';
  let dayConversion = '';
  let hoursMinutes = '';

  // Group weather data by day
  const groupWeatherByDay = () => {
    const grouped = {};
    
    weather.forEach((item, index) => {
      const day = new Date((item.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({ ...item, index });
    });
    
    return grouped;
  };

  (hoursMinutes = {
    sunriseHour: String((new Date(times.sunrise * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
    sunriseMinute: String((new Date(times.sunrise * 1000)).getMinutes()).padStart(2, '0'),
    sunsetHour: String((new Date(times.sunset * 1000)).getHours()).padStart(2, '0'),
    sunsetMinute: String((new Date(times.sunset * 1000)).getMinutes()).padStart(2, '0'),
  });

  let sunriseHourConversion = (
    Math.round((((hoursMinutes.sunriseHour * 3600) + (new Date().getTimezoneOffset() * 60)) + times.timeZone) / 3600)
  );

  let sunsetHourConversion = (
    Math.round((((hoursMinutes.sunsetHour * 3600) + (new Date().getTimezoneOffset() * 60)) + times.timeZone) / 3600)
  );

  return (
    <div className='text-white overflow-hidden flex flex-col min-h-screen bg-black'>
      <Header/>
      <div className="text-center text-white flex-grow flex flex-col">
          <p className='text-3xl font-bold my-5 underline lg:text-4xl'>3 Hour Forecast Data - {location.name}</p>
          {(weather.length > 0) ? (
            Object.entries(groupWeatherByDay()).map(([day, dayWeather]) => (
              <div key={day} className="mb-4">
                <h2 className="text-3xl font-bold py-3 bg-neutral-800 border-b-2">{day}</h2>
                {dayWeather.map((weather) => {
                  const hourConversion = Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600);
                  return (
                    <button 
                      key={weather.index} 
                      onClick={(e) => handleSubmit(e, weather.index)} 
                      className='duration-300 hover:cursor-pointer hover:text-4xl hover:bg-cyan-800 lg:flex-row flex flex-col border-b-2 text-white h-fit w-screen'
                    >
                      <span className="lg:ml-5 mx-auto mt-5 lg:my-auto lg:mr-7">
                        <WeatherIcons mainWeather={weather.mainWeather} windSpeed={weather.windSpeed} description={weather.description} timeZone={times.timeZone} sunriseHour={sunriseHourConversion} sunsetHour={sunsetHourConversion} hourConversion={hourConversion} page={isDesktopView ? 'multiple' : 'multiple-mobile'}/>
                      </span>
                      <span className='lg:my-3.5 font-bold text-xl lg:mr-10 mt-5 mx-auto'>{(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:{weather.timeNormalMinutes} ({<TimeZoneShow timeZone={location.timeZone}/>})</span>
                      <span className='lg:my-3 lg:mr-10 font-bold text-2xl mt-5 mx-auto'>{weather.description.toUpperCase()}</span>
                      <span className='lg:my-3 lg:mr-9 text-xl mt-5 mx-auto'>Temp: {Math.round(weather.temperature)}°C</span>
                      <span className='lg:my-3 lg:mr-9 text-xl mt-5 mx-auto'>Wind Speed: {weather.windSpeed} m/s ({<WindForce windSpeed={weather.windSpeed} />})&ensp; Wind Direction: {<WindDirection windDegrees={weather.windDegrees}/>} @ {weather.windDegrees}°</span>
                      <span className='lg:my-3 lg:mr-9 text-xl mt-5 mx-auto'>Precipitation: {weather.precipitation}%</span>
                      <span className='lg:my-3 lg:mr-9 text-xl my-5 mx-auto'>Visibility: {(weather.visibility >= 1000) ?
                        (weather.visibility / 1000) + 'km' :
                        (weather.visibility) + 'm'} ({<VisibilityDesc visibility={weather.visibility}/>})
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <></>
          )}
      </div>
      <Footer />
    </div>
  )
}