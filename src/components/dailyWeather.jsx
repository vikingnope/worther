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
  let hourConversionShowOnly = '';

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
    <div className='select-none text-white'>
      <Header choice='showWeather'/>
      <div className="text-center select-none bg-black text-white min-h-screen flex flex-col">
          <p className='text-4xl font-bold my-5 underline'>Daily Forecast Data - {location.name}</p>
          <div className="flex flex-row my-auto">
            {(weather.length > 0) ?
              (
                weather.map((weather, index) => ( // * .map is used instead of loops
                  hourConversion = (
                    Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600)
                  ),
                  dayConversion = (
                    new Date((weather.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString()
                  ),
                  hourConversionShowOnly = (
                    (hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')
                  ),
                  [
                    (hourConversionShowOnly === '11' || hourConversionShowOnly === '12' || hourConversionShowOnly === '13') ?
                      <div key={index} className='flex flex-col duration-300 hover:bg-cyan-800 border-2 rounded-xl text-white h-fit w-80 mx-auto'>
                          <p className="mx-auto mt-10">
                            <WeatherIcons mainWeather={weather.mainWeather} windSpeed={weather.windSpeed} description={weather.description} timeZone={times.timeZone} sunriseHour={sunriseHourConversion} sunsetHour={sunsetHourConversion} hourConversion={hourConversion} page={'daily'}/>
                          </p>
                          <p className='mx-auto mt-10 font-bold text-2xl block underline'>{dayConversion}</p>
                          <p className='mx-auto mt-10 font-bold text-2xl block'>{weather.description.toUpperCase()}</p>
                          <p className='mx-auto mt-10 text-xl block'>Temp: {Math.round(weather.temperature)}°C</p>
                          <p className='mx-auto mt-10 text-xl block'>Wind Speed: {weather.windSpeed} m/s ({<WindForce windSpeed={weather.windSpeed} />})</p>
                          <p className='mx-auto mt-10 text-xl block'>Wind Direction: {<WindDirection windDegrees={weather.windDegrees}/>} @ {weather.windDegrees}°</p>
                          <p className='mx-auto mt-10 text-xl block'>Precipitation: {weather.precipitation}%</p>
                          <p className='mx-auto mt-10 text-xl block'>Visibility: {(weather.visibility >= 1000) ?
                          (weather.visibility / 1000) + 'km' :
                          (weather.visibility) + 'm'} ({<VisibilityDesc visibility={weather.visibility}/>})
                          </p>
                          <p className='mx-auto mt-10 text-xl block'>{<BsFillSunriseFill size={40} className="inline mr-2"/>}Sunrise: {(sunriseHourConversion > 23) ? String(sunriseHourConversion - 24).padStart(2, '0') : String(sunriseHourConversion).padStart(2, '0')}:{hoursMinutes.sunriseMinute} ({<TimeZoneShow timeZone={times.timeZone}/>})</p>
                          <p className='mx-auto my-10 text-xl block'>{<BsFillSunsetFill size={40} className="inline mr-2"/>}Sunset: {(sunsetHourConversion < 0) ? (sunsetHourConversion + 24) : sunsetHourConversion}:{hoursMinutes.sunsetMinute} ({<TimeZoneShow timeZone={times.timeZone}/>})</p>
                      </div> 
                      : 
                      <></>
                  ]
                ))
              ) :
              <></>
            }
          </div>
      </div>
      <Footer />
    </div>
  )
}