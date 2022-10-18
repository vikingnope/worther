import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { ShowWeather } from './utils/weatherVariables';

export const SingleThreeHourWeatherData = () => {
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

  document.title = "Worther - 5 Day Weather - " + location.name;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)    
    .then(response => {
      console.log(response.data);
      for (let i = 0; i < response.data.list.length; i++){
        if (i == index && i < 4) {
          const weatherObj = {
            humidity: response.data.list[i].main.humidity,
            temperature: response.data.list[i].main.temp,
            tempMax: response.data.list[i].main.temp_max,
            tempMin: response.data.list[i].main.temp_min,
            tempFeel: response.data.list[i].main.feels_like,
            pressure: response.data.list[i].main.pressure,
            mainWeather: response.data.list[i].weather[0].main,
            description: response.data.list[i].weather[0].description,
            windSpeed: response.data.list[i].wind.speed,
            windDegrees: response.data.list[i].wind.deg,
            visibility: response.data.list[i].visibility,
            dayUNIX: ((response.data.list[i].dt) * 1000),
            rain: response.data.list[i].rain['3h'],
            timeNormalHour: String((new Date((response.data.list[i].dt) * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
            timeNormalMinutes: String((new Date((response.data.list[i].dt) * 1000)).getMinutes()).padStart(2, '0')
          }
          setWeather(weatherObj)
        } else if (i == index) {
          const weatherObj = {
            humidity: response.data.list[i].main.humidity,
            temperature: response.data.list[i].main.temp,
            tempMax: response.data.list[i].main.temp_max,
            tempMin: response.data.list[i].main.temp_min,
            tempFeel: response.data.list[i].main.feels_like,
            pressure: response.data.list[i].main.pressure,
            mainWeather: response.data.list[i].weather[0].main,
            description: response.data.list[i].weather[0].description,
            windSpeed: response.data.list[i].wind.speed,
            windDegrees: response.data.list[i].wind.deg,
            visibility: response.data.list[i].visibility,
            dayUNIX: ((response.data.list[i].dt) * 1000),
            timeNormalHour: String((new Date((response.data.list[i].dt) * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
            timeNormalMinutes: String((new Date((response.data.list[i].dt) * 1000)).getMinutes()).padStart(2, '0')
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
  }, []);

  var hourConversion = '';
  var dayConversion = '';

  return (
    console.log(weather.rain),
    hourConversion = (
      Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600)
    ),
    dayConversion = (
      new Date((weather.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString()
    ),

    <ShowWeather rain = {weather.rain} index = {index} dayConversion= {dayConversion} hourConversion = {hourConversion} timeNormalMinutes = {weather.timeNormalMinutes} connectionError = {connectionError} mainWeather = {weather.mainWeather} description = {weather.description} name = {location.name} country = {location.country} temperature = {weather.temperature} tempFeel = {weather.tempFeel} tempMax = {weather.tempMax} tempMin = {weather.tempMin} humidity = {weather.humidity} windSpeed={weather.windSpeed} pressure = {weather.pressure} visibility = {weather.visibility} windDegrees = {weather.windDegrees} loaded = {loaded} blocked={blocked} handleSubmit={handleSubmit} timeUpdatedUNIX={weather.timeUpdatedUNIX} timeZone={location.timeZone} city={location.name}/>  
  )
}