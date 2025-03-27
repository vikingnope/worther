import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ShowWeather, SunriseSunsetTimes } from "./utils/weatherVariables";
import { Header } from "./utils/header";
import { Footer } from "./utils/footer";

export const GetSingleWeather = () => {

    const { countryCode, city, latitude, longitude } = useParams(); // * Gets city from the url

    const history = useNavigate();

    const [ location, setLocation ] = useState([]);
    const [ weather, setWeather ] = useState([]);
    const [ loaded, setLoaded ] = useState();
    const [ times, setTimes ] = useState([]);
    const [ blocked, setBlocked ] = useState();
    const [ connectionError, setConnectionError ] = useState();

    const handleSubmit3Hour = useCallback((e) => {
      e.preventDefault();
  
      history('/3HourForecast/' + location.lat + '/' + location.lon);
    }, [history, location.lat, location.lon]);

    const handleSubmitDaily = useCallback((e) => {
      e.preventDefault();
  
      history('/dailyWeather/' + location.lat + '/' + location.lon);
    }, [history, location.lat, location.lon]);

    useEffect(() => {
      ((location.name) ?
      document.title = "Worther - Weather - " + location.name :
      document.title = "Worther - Weather");
    }, [location.name]);

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
          rain: (response.data.rain !== undefined) ? response.data.rain['1h'] : undefined,
          timeUpdatedUNIX: response.data.dt,
          timeZone: response.data.timezone
        }
        setWeather(weatherObj);

        const locationObj = {
          name: response.data.name,
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
          country: response.data.sys.country
        }
        setLocation(locationObj);

        const timesObj = {
          sunrise: response.data.sys.sunrise,
          sunset: response.data.sys.sunset,
          timeZone: response.data.timezone
        }
        setTimes(timesObj)
      
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
    }, [city, countryCode, latitude, longitude]);   

    const localSunriseSunsetTimes = useMemo(() => {
      if (times && times.sunrise && times.sunset && times.timeZone) {
      return SunriseSunsetTimes(times);
      }
      return null;
    }, [times]);

    return(
      loaded ? (
        <ShowWeather 
          connectionError = {connectionError} 
          choice = {'normal'} 
          mainWeather = {weather.mainWeather} 
          description = {weather.description} 
          name = {location.name} 
          country = {location.country} 
          temperature = {weather.temperature} 
          tempFeel = {weather.tempFeel} 
          tempMax = {weather.tempMax} 
          tempMin = {weather.tempMin} 
          humidity = {weather.humidity} 
          windSpeed={weather.windSpeed} 
          pressure = {weather.pressure} 
          visibility = {weather.visibility} 
          windDegrees = {weather.windDegrees} 
          loaded = {loaded} 
          blocked={blocked} 
          handleSubmit3Hour={handleSubmit3Hour} 
          handleSubmitDaily={handleSubmitDaily} 
          sunrise={weather.sunrise} 
          sunset={weather.sunset} 
          timeUpdatedUNIX={weather.timeUpdatedUNIX} 
          rain={weather.rain} 
          times={times} 
          city={city} 
          timeZone={weather.timeZone}
          localSunriseSunsetTimes={localSunriseSunsetTimes}
        />
      ) : (
        <div className="flex flex-col min-h-screen text-white overflow-hidden bg-black">
          <Header/>
          <main className="flex flex-col md:items-center justify-center flex-grow">
            <p className="uppercase font-bold md:text-3xl text-xl md:mb-14 mt-8 md:mt-0">
              Loading...
            </p>
          </main>
          <Footer />
        </div>
      ))
  };
