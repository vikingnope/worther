import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ShowWeather } from "./utils/weatherVariables";

export const GetOpenWeatherData = () => {

    const { countryCode, city, latitude, longitude } = useParams(); // Gets city from the url

    const history = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
  
      history('/3HourWeather/' + location.lat + '/' + location.lon);
    }

    const [ location, setLocation ] = useState([]);
    const [ weather, setWeather ] = useState([]);
    const [ loaded, setLoaded ] = useState();
    const [ blocked, setBlocked ] = useState();
    const [ connectionError, setConnectionError ] = useState();

    ((location.name) ?
    document.title = "Worther - Weather - " + location.name :
    document.title = "Worther - Weather");

    useEffect(() => {
      axios.get((countryCode === undefined && latitude === undefined && longitude === undefined) ?
      (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`) :
      (latitude === undefined && longitude === undefined) ?
      (`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`) :
      (`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`))
      .then(response => {
        const weatherObj = {
          humidity: response.data.main.humidity,
          temperature: response.data.main.temp,
          tempMax: response.data.main.temp_max,
          tempMin: response.data.main.temp_min,
          tempFeel: response.data.main.feels_like,
          pressure: response.data.main.pressure,
          mainWeather: response.data.weather[0].main,
          description: response.data.weather[0].description,
          windSpeed: response.data.wind.speed,
          windDegrees: response.data.wind.deg,
          sunrise: response.data.sys.sunrise,
          sunset: response.data.sys.sunset,
          visibility: response.data.visibility,
          timeUpdatedUNIX: response.data.dt
        }
        setWeather(weatherObj);

        const locationObj = {
          name: response.data.name,
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
          country: response.data.sys.country,
          timeZone: response.data.timezone
        }
        setLocation(locationObj);
      
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

    return(
      <ShowWeather connectionError = {connectionError} choice = {'normal'} mainWeather = {weather.mainWeather} description = {weather.description} name = {location.name} country = {location.country} temperature = {weather.temperature} tempFeel = {weather.tempFeel} tempMax = {weather.tempMax} tempMin = {weather.tempMin} humidity = {weather.humidity} windSpeed={weather.windSpeed} pressure = {weather.pressure} visibility = {weather.visibility} windDegrees = {weather.windDegrees} loaded = {loaded} blocked={blocked} handleSubmit={handleSubmit} sunrise={weather.sunrise} sunset={weather.sunset} timeUpdatedUNIX={weather.timeUpdatedUNIX} timeZone={location.timeZone} city={city}/>
    )
  };
