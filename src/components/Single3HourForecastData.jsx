import {useEffect, useState, useCallback, useMemo, memo } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { ShowWeather } from './utils/weatherVariables';

export const SingleThreeHourForecastData = memo(() => {
  const { index, lat, lon } = useParams();
  const numericIndex = parseInt(index, 10); // Convert index to a number

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ loaded, setLoaded ] = useState();
  const [ blocked, setBlocked ] = useState();
  const [ connectionError, setConnectionError ] = useState();

  const history = useNavigate();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    history('/weather/' +  location.name + '/' + location.lat + '/' + location.lon);
  }, [history, location.lat, location.lon, location.name]);

  useEffect(() => {
    document.title = "Worther - 3 Hour Weather - " + location.name;
  }, [location.name]);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`)    
    .then(response => {
      for (const [i, weatherAPI] of response.data.list.entries()) {
        if (i === numericIndex) {
          const weatherObj = {
            humidity: weatherAPI.main.humidity,
            temperature: weatherAPI.main.temp,
            tempMax: weatherAPI.main.temp_max,
            tempMin: weatherAPI.main.temp_min,
            tempFeel: weatherAPI.main.feels_like,
            precipitation: weatherAPI.pop * 100,
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
      const errorState = {
        loaded: false,
        blocked: error.response?.data.cod === 429,
        connectionError: error.response?.data.code === 'ERR_NETWORK'
      };
      
      setLoaded(errorState.loaded);
      setBlocked(errorState.blocked);
      setConnectionError(errorState.connectionError);
    });
  }, [index, numericIndex, lat, lon]);

  const hourConversion = useMemo(() => {
    if (!weather.timeNormalHour || location.timeZone === undefined) return 0;
    return Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600);
  }, [weather.timeNormalHour, location.timeZone]);

  const dayConversion = useMemo(() => {
    if (!weather.dayUNIX || location.timeZone === undefined) return 0;
    return new Date((weather.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString();
  }, [weather.dayUNIX, location.timeZone]);

  const currentTime = useMemo(() => {
    const d = new Date();
    return {
      hour: d.getHours(),
      minute: d.getMinutes()
    };
  }, []);

  return (
    <ShowWeather 
      index = {index} 
      currentTime={currentTime} 
      dayConversion= {dayConversion} 
      hourConversion = {hourConversion} 
      timeNormalMinutes = {weather.timeNormalMinutes} 
      connectionError = {connectionError} 
      mainWeather = {weather.mainWeather} 
      description = {weather.description} 
      name = {location.name} 
      country = {location.country} 
      temperature = {weather.temperature} 
      tempFeel = {weather.tempFeel} 
      tempMax = {weather.tempMax} 
      tempMin = {weather.tempMin} 
      precipitation={weather.precipitation} 
      humidity = {weather.humidity} 
      windSpeed={weather.windSpeed} 
      pressure = {weather.pressure} 
      visibility = {weather.visibility} 
      windDegrees = {weather.windDegrees} 
      loaded = {loaded} 
      blocked={blocked} 
      handleSubmit={handleSubmit} 
      timeUpdatedUNIX={weather.timeUpdatedUNIX} 
      timeZone={location.timeZone} 
      city={location.name} 
      lat = {lat} 
      lon = {lon}
    />  
  )
});

SingleThreeHourForecastData.displayName = 'SingleThreeHourForecastData';