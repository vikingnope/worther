import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "./utils/header";
import { Footer } from "./utils/footer";
import { BsFillSunFill } from 'react-icons/bs'; // sunny
import { AiFillCloud } from 'react-icons/ai'; // cloudy
import { BsFillCloudRainHeavyFill } from 'react-icons/bs'; // heavy intensity rain
import { BsFillCloudDrizzleFill } from 'react-icons/bs' // drizzle
import { BsFillCloudLightningRainFill } from 'react-icons/bs'; // thunder and rain
import { BsFillCloudSnowFill } from 'react-icons/bs'; // snow
import { BsCloudFog } from 'react-icons/bs'; // fog
import { BsFillCloudRainFill } from 'react-icons/bs'; // light rain
import { BsFillCloudsFill } from 'react-icons/bs'; // overcast clouds
import { BsFillCloudSunFill } from 'react-icons/bs'; // scattered clouds

var sunriseTimeConversion;
var sunsetTimeConversion;
var timeUpdatedConversion;

export const GetOpenWeatherData = () => {

    const { countryCode, city, latitude, longitude } = useParams(); // Gets city from the url

    const history = useNavigate();

    const APIkey = '45245b26fa062bdd9ca60efac28d1c01';

    const handleSubmit = (e) => {
      e.preventDefault();
  
      history('/weather/' + city + '/' + location.lat + '/' + location.lon);
    }

    const [ location, setLocation ] = useState([]);
    const [ weather, setWeather ] = useState([]);
    const [ visibilityDescription, setVisibilityDescription ] = useState();
    const [ windDirection, setWindDirection ] = useState();
    const [ times, setTimes ] = useState([]);
    const [ timeZone, setTimeZone ] = useState();
    const [ loaded, setLoaded ] = useState();
    const [ blocked, setBlocked ] = useState();

    sunriseTimeConversion = new Date(weather.sunrise * 1000);
    sunsetTimeConversion = new Date(weather.sunset * 1000);
    timeUpdatedConversion = new Date(weather.timeUpdatedUNIX * 1000);

    ((location.name) ?
    document.title = "Worther - Weather - " + location.name :
    document.title = "Worther - Weather");

    useEffect(() => {
      axios.get((countryCode === undefined && latitude === undefined && longitude === undefined) ?
      (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`) :
      (latitude === undefined && longitude === undefined) ?
      (`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${APIkey}&units=metric`) :
      (`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`))
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
          country: response.data.sys.country
        }
        setLocation(locationObj);

        ((weather.visibility < 50) ?
          setVisibilityDescription('Dense Fog') :
        (weather.visibility >= 50 && weather.visibility < 200) ?
          setVisibilityDescription('Thick Fog') :
        (weather.visibility >= 200 && weather.visibility < 500) ?
          setVisibilityDescription('Moderate Fog') :
        (weather.visibility >= 500 && weather.visibility < 1000) ?
          setVisibilityDescription('Light Fog') :
        (weather.visibility >= 1000 && weather.visibility < 2000) ?
          setVisibilityDescription('Thin Fog') :
        (weather.visibility >= 2000 && weather.visibility < 4000) ?
          setVisibilityDescription('Haze') :
        (weather.visibility >= 4000 && weather.visibility < 10000) ?
          setVisibilityDescription('Light Haze') :
        (weather.visibility === 10000) ?
          setVisibilityDescription('Clear') :
          <></>
        );

        (((weather.windDegrees >= 0 && weather.windDegrees <= 11.25) || (weather.windDegrees  > 348.75)) ? 
          setWindDirection('N')  : 
        (weather.windDegrees >= 11.26 && weather.windDegrees < 33.75) ?
          setWindDirection('NNE') :
        (weather.windDegrees >= 33.75 && weather.windDegrees < 56.25) ?
          setWindDirection('NE') :
        (weather.windDegrees >= 56.25 && weather.windDegrees < 78.75) ?
          setWindDirection('ENE') :
        (weather.windDegrees >= 78.75 && weather.windDegrees < 101.25) ?
          setWindDirection('E') :
        (weather.windDegrees >= 101.25 && weather.windDegrees < 123.75) ?
          setWindDirection('ESE') :
        (weather.windDegrees >= 123.75 && weather.windDegrees < 146.25) ?
          setWindDirection('SE') :
        (weather.windDegrees >= 146.25 && weather.windDegrees < 168.75) ?
          setWindDirection('SSE') :
        (weather.windDegrees >= 168.75 && weather.windDegrees < 191.25) ?
          setWindDirection('S') : 
        (weather.windDegrees >= 191.25 && weather.windDegrees < 213.75) ?
          setWindDirection('SSW') :
        (weather.windDegrees >= 213.75 && weather.windDegrees < 236.25) ?
          setWindDirection('SW') :
        (weather.windDegrees >= 236.25 && weather.windDegrees < 258.75) ?
          setWindDirection('WSW') :
        (weather.windDegrees >= 258.75 && weather.windDegrees < 281.25) ?
          setWindDirection('W') :
        (weather.windDegrees >= 281.25 && weather.windDegrees < 303.75) ?
          setWindDirection('WNW') :
        (weather.windDegrees >= 303.75 && weather.windDegrees < 326.25) ?
          setWindDirection('NW') :
        (weather.windDegrees >= 326.25 && weather.windDegrees < 348.75) ?
          setWindDirection('NNW') :                          
        <> </>);
        
        ((sunriseTimeConversion.getTimezoneOffset() === 0) ?
          setTimeZone('GMT') :
        (sunriseTimeConversion.getTimezoneOffset() === 60) ?
          setTimeZone('GMT-1') :
        (sunriseTimeConversion.getTimezoneOffset() === 120) ?
          setTimeZone('GMT-2') :
        (sunriseTimeConversion.getTimezoneOffset() === 180) ?
          setTimeZone('GMT-3') :
        (sunriseTimeConversion.getTimezoneOffset() === 240) ?
          setTimeZone('GMT-4') :
        (sunriseTimeConversion.getTimezoneOffset() === 300) ?
          setTimeZone('GMT-5') :
        (sunriseTimeConversion.getTimezoneOffset() === 360) ?
          setTimeZone('GMT-6') :
        (sunriseTimeConversion.getTimezoneOffset() === 420) ?
          setTimeZone('GMT-7') :
        (sunriseTimeConversion.getTimezoneOffset() === 480) ?
          setTimeZone('GMT-8') :
        (sunriseTimeConversion.getTimezoneOffset() === 540) ?
          setTimeZone('GMT-9') :
        (sunriseTimeConversion.getTimezoneOffset() === 600) ?
          setTimeZone('GMT-10') :
        (sunriseTimeConversion.getTimezoneOffset() === 660) ?
          setTimeZone('GMT-11') :
        (sunriseTimeConversion.getTimezoneOffset() === 720) ?
          setTimeZone('GMT-12') :
        (sunriseTimeConversion.getTimezoneOffset() === -60) ?
          setTimeZone('GMT+1') :
        (sunriseTimeConversion.getTimezoneOffset() === -120) ?
          setTimeZone('GMT+2') :
        (sunriseTimeConversion.getTimezoneOffset() === -180) ?
          setTimeZone('GMT+3') :
        (sunriseTimeConversion.getTimezoneOffset() === -240) ?
          setTimeZone('GMT+4') :
        (sunriseTimeConversion.getTimezoneOffset() === -300) ?
          setTimeZone('GMT+5') :
        (sunriseTimeConversion.getTimezoneOffset() === -360) ?
          setTimeZone('GMT+6') :
        (sunriseTimeConversion.getTimezoneOffset() === -420) ?
          setTimeZone('GMT+7') :
        (sunriseTimeConversion.getTimezoneOffset() === -480) ?
          setTimeZone('GMT+8') :
        (sunriseTimeConversion.getTimezoneOffset() === -540) ?
          setTimeZone('GMT+9') :
        (sunriseTimeConversion.getTimezoneOffset() === -600) ?
          setTimeZone('GMT+10') :
        (sunriseTimeConversion.getTimezoneOffset() === -660) ?
          setTimeZone('GMT+11') :   
        (sunriseTimeConversion.getTimezoneOffset() === -720) ?
          setTimeZone('GMT+12') :
        (sunriseTimeConversion.getTimezoneOffset() === -780) ?
          setTimeZone('GMT+13') : 
        (sunriseTimeConversion.getTimezoneOffset() === -840) ?
          setTimeZone('GMT+14') :                 
        <></> 
        );

        const timesObj = {
          sunriseHour: String(sunriseTimeConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
          sunriseMinute: String(sunriseTimeConversion.getMinutes()).padStart(2, '0'),
          sunsetHour: String(sunsetTimeConversion.getHours()).padStart(2, '0'),
          sunsetMinute: String(sunsetTimeConversion.getMinutes()).padStart(2, '0'),
          timeUpdatedHour: String(timeUpdatedConversion.getHours()).padStart(2, '0'),
          timeUpdatedMinute: String(timeUpdatedConversion.getMinutes()).padStart(2, '0')
        }
        setTimes(timesObj);
      
        setLoaded(true);
      })
      .catch(error => {
        ((error.response.data.cod === 429) ?
          setBlocked(true) :
          setBlocked(false)
        )
        setLoaded(false);
      })
    }, [!times]);

    return(
    <div className="text-white">
      <Header choice={'showWeather'}/>
      <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
        {(loaded) ?
          ((weather.mainWeather) ?
            <>
              <section className="mx-auto mb-4">
                {(weather.mainWeather === "Clear") ?
                  <BsFillSunFill size={'200'} color={'white'} /> :
                (weather.description === "scattered clouds" || weather.description === "broken clouds") ?
                  <BsFillCloudSunFill size={'200'} color={'white'} className="mb-0" /> :
                (weather.description === "few clouds") ?
                  <AiFillCloud size={'200'} color={'white'} className="mb-0" /> :
                (weather.description === "overcast clouds") ?
                  <BsFillCloudsFill size={'200'} color={'white'} className="mb-0" /> :
                (weather.description === "light rain") ?
                  <BsFillCloudRainFill size={'200'} color={'white'} /> :
                (weather.description === "heavy intensity rain" || weather.description === "moderate rain") ?
                  <BsFillCloudRainHeavyFill size={'200'} color={'white'} /> :
                (weather.mainWeather === "Drizzle") ?
                  <BsFillCloudDrizzleFill size={'200'} color={'white'} /> :
                (weather.description === "thunderstorm with light rain") ?
                  <BsFillCloudLightningRainFill  size={'200'} color={'white'} className="mb-0" /> :
                (weather.mainWeather === "Fog") ?
                  <BsCloudFog size={'200'} color={'white'} /> :
                (weather.mainWeather === "Snow") ?
                  <BsFillCloudSnowFill size={'200'} color={'white'} /> :
                <> </>}

              </section>
              <section className="text-lg">
                <p className="underline text-3xl font-bold">{location.name}, {location.country}</p>
                <p className="font-bold text-3xl mt-4">{weather.description.toUpperCase()}</p>
                <p className="mt-1">Temperature: {Math.round(weather.temperature)}°C</p>
                <p>Feels like: {Math.round(weather.tempFeel)}°C</p>
                <p>Max: {Math.round(weather.tempMax)}°C &emsp; Min: {Math.round(weather.tempMin)}°C</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Wind Speed: {weather.windSpeed} m/s &emsp; Wind Direction: {weather.windDirection} @ {weather.windDegrees}°</p>
                <p>Pressure: {weather.pressure} hPa</p>
                <p>Visibility: {(weather.visibility >= 1000) ?
                  (weather.visibility / 1000) + 'km' :
                  (weather.visibility) + 'm'} ({visibilityDescription})
                </p>
                <p>Sunrise: {times.sunriseHour}:{times.sunriseMinute} ({timeZone}) &emsp; Sunset: {times.sunsetHour}:{times.sunsetMinute} ({timeZone})</p>
              </section><form onSubmit={handleSubmit}>
                <button type='submit' className="text-lg underline mt-5 font-bold">Show 3 hour weather</button>
              </form>
              <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
              <p className="absolute -bottom-12 right-1.5 underline">Last Updated: {times.timeUpdatedHour}:{times.timeUpdatedMinute}</p>
          </> :
          <>
            <p className="text-3xl uppercase font-bold">The city you have entered ('{city}') has not been found</p>
            <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
          </>
          ) :
          (loaded === false && blocked === true) ?
          <>
            <p className="text-4xl uppercase font-bold">The API is currently blocked</p>
            <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
          </> :
          (loaded === false && !weather.mainWeather) ?
            <>
              <p className="text-3xl uppercase font-bold">The city you have entered ('{city}') has not been found</p>
              <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
            </>
          :     
          <p className="font-bold text-2xl">Loading...</p>
        }  
      </div>
      <Footer />
    </div>
    )  
  };
