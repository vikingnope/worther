import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { ShowWeather } from './utils/weatherVariables';

export const SingleThreeHourForecastData = () => {
  const { index, lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ loaded, setLoaded ] = useState();
  const [ blocked, setBlocked ] = useState();
  const [ connectionError, setConnectionError ] = useState();

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    history('/weather/' +  location.name + '/' + location.lat + '/' + location.lon);
  }

  document.title = "Worther - 3 Hour Weather - " + location.name;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`)    
    .then(response => {
      for (const [i, weatherAPI] of response.data.list) {
        if (i === index) {
          const weatherObj = {
            humidity: weatherAPI.main.humidity,
            temperature: weatherAPI.main.temp,
            tempMax: weatherAPI.main.temp_max,
            tempMin: weatherAPI.main.temp_min,
            tempFeel: weatherAPI.main.feels_like,
            pressure: weatherAPI.main.pressure,
            mainWeather: weatherAPI.weather[0].main,
            description: weatherAPI.weather[0].description,
            windSpeed: weatherAPI.wind.speed,
            windDegrees: weatherAPI.wind.deg,
            visibility: weatherAPI.visibility,
            dayUNIX: ((weatherAPI.dt) * 1000),
            timeNormalHour: String((new Date((weatherAPI.dt) * 1000)).getHours()).padStart(2, '0'), // * padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
            timeNormalMinutes: String((new Date((weatherAPI.dt) * 1000)).getMinutes()).padStart(2, '0')
          }
          setWeather(weatherObj)
        }
      }

      const locationObj = {
        name: response.data.city.name,
        country: response.data.city.country,
        timeZone: response.data.city.timezone
      }
      setLocation(locationObj)

      setLoaded(true);
    })
    .catch(error => {
      ((error.response.data.cod === 429) ?
      setBlocked(true) :
      (error.response.data.code === 'ERR_NETWORK') ?
      setConnectionError(true) :
      setBlocked(false)
    )
    setLoaded(false);
    })
  }, [index, lat, lon]);

  let hourConversion = '';
  let dayConversion = '';
  let d = new Date();
  let currentTime = [];


  return (
    hourConversion = (
      Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600)
    ),
    dayConversion = (
      new Date((weather.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString()
    ),
    currentTime = {
      hour: d.getHours(),
      minute: d.getMinutes()
    },
    <ShowWeather index = {index} currentTime={currentTime} dayConversion= {dayConversion} hourConversion = {hourConversion} timeNormalMinutes = {weather.timeNormalMinutes} connectionError = {connectionError} mainWeather = {weather.mainWeather} description = {weather.description} name = {location.name} country = {location.country} temperature = {weather.temperature} tempFeel = {weather.tempFeel} tempMax = {weather.tempMax} tempMin = {weather.tempMin} humidity = {weather.humidity} windSpeed={weather.windSpeed} pressure = {weather.pressure} visibility = {weather.visibility} windDegrees = {weather.windDegrees} loaded = {loaded} blocked={blocked} handleSubmit={handleSubmit} timeUpdatedUNIX={weather.timeUpdatedUNIX} timeZone={location.timeZone} city={location.name} lat = {lat} lon = {lon}/>  
  )
}