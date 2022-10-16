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
import { BsFillCloudHazeFill } from 'react-icons/bs'; // haze

export const GetOpenWeatherData = () => {

    var times = {};
    var windDirection = '';
    var timeZoneShown = '';
    var visibilityDescription = '';

    const { countryCode, city, latitude, longitude } = useParams(); // Gets city from the url

    const history = useNavigate();

    const APIkey = '45245b26fa062bdd9ca60efac28d1c01';

    const handleSubmit = (e) => {
      e.preventDefault();
  
      history('/weather/' +  location.name + '/' + location.lat + '/' + location.lon);
    }

    const [ location, setLocation ] = useState([]);
    const [ weather, setWeather ] = useState([]);
    const [ loaded, setLoaded ] = useState();
    const [ blocked, setBlocked ] = useState();

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
          country: response.data.sys.country,
          timeZone: response.data.timezone
        }
        setLocation(locationObj);
      
        setLoaded(true);
      })
      .catch(error => {
        ((error.response.data.cod === 429) ?
          setBlocked(true) :
          setBlocked(false)
        )
        setLoaded(false);
      })
    }, []);

    (((weather.windDegrees >= 0 && weather.windDegrees <= 11.25) || (weather.windDegrees  > 348.75)) ? 
          windDirection = 'N'  : 
        (weather.windDegrees >= 11.26 && weather.windDegrees < 33.75) ?
          windDirection = 'NNE' :
        (weather.windDegrees >= 33.75 && weather.windDegrees < 56.25) ?
          windDirection = 'NE' :
        (weather.windDegrees >= 56.25 && weather.windDegrees < 78.75) ?
          windDirection = 'ENE' :
        (weather.windDegrees >= 78.75 && weather.windDegrees < 101.25) ?
          windDirection = 'E' :
        (weather.windDegrees >= 101.25 && weather.windDegrees < 123.75) ?
          windDirection = 'ESE' :
        (weather.windDegrees >= 123.75 && weather.windDegrees < 146.25) ?
          windDirection = 'SE' :
        (weather.windDegrees >= 146.25 && weather.windDegrees < 168.75) ?
          windDirection = 'SSE' :
        (weather.windDegrees >= 168.75 && weather.windDegrees < 191.25) ?
          windDirection = 'S' : 
        (weather.windDegrees >= 191.25 && weather.windDegrees < 213.75) ?
          windDirection = 'SSW' :
        (weather.windDegrees >= 213.75 && weather.windDegrees < 236.25) ?
          windDirection = 'SW' :
        (weather.windDegrees >= 236.25 && weather.windDegrees < 258.75) ?
          windDirection = 'WSW' :
        (weather.windDegrees >= 258.75 && weather.windDegrees < 281.25) ?
          windDirection = 'W' :
        (weather.windDegrees >= 281.25 && weather.windDegrees < 303.75) ?
          windDirection = 'WNW' :
        (weather.windDegrees >= 303.75 && weather.windDegrees < 326.25) ?
          windDirection = 'NW' :
        (weather.windDegrees >= 326.25 && weather.windDegrees < 348.75) ?
          windDirection = 'NNW' :                          
        <> </>);

    (times = {
      sunriseHour: String((new Date(weather.sunrise * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
      sunriseMinute: String((new Date(weather.sunrise * 1000)).getMinutes()).padStart(2, '0'),
      sunsetHour: String((new Date(weather.sunset * 1000)).getHours()).padStart(2, '0'),
      sunsetMinute: String((new Date(weather.sunset * 1000)).getMinutes()).padStart(2, '0'),
      timeUpdatedHour: String((new Date(weather.timeUpdatedUNIX * 1000)).getHours()).padStart(2, '0'),
      timeUpdatedMinute: String((new Date(weather.timeUpdatedUNIX * 1000)).getMinutes()).padStart(2, '0')
    });

    ((location.timeZone === 0) ?
      timeZoneShown = 'GMT' :
    (location.timeZone === -3600) ?
      timeZoneShown = 'GMT-1' :
    (location.timeZone === -7200) ?
      timeZoneShown = 'GMT-2' :
    (location.timeZone === -10800) ?
      timeZoneShown = 'GMT-3' :
    (location.timeZone === -14400) ?
      timeZoneShown = 'GMT-4' :
    (location.timeZone === -18000) ?
      timeZoneShown = 'GMT-5' :
    (location.timeZone === -21600) ?
      timeZoneShown = 'GMT-6' :
    (location.timeZone === -25200) ?
      timeZoneShown = 'GMT-7' :
    (location.timeZone === -28800) ?
      timeZoneShown = 'GMT-8' :
    (location.timeZone === -32400) ?
      timeZoneShown = 'GMT-9' :
    (location.timeZone === -36000) ?
      timeZoneShown = 'GMT-10' :
    (location.timeZone === -39600) ?
      timeZoneShown = 'GMT-11' :
    (location.timeZone === -43200) ?
      timeZoneShown = 'GMT-12' :
    (location.timeZone === 3600) ?
      timeZoneShown = 'GMT+1' :
    (location.timeZone === 7200) ?
      timeZoneShown = 'GMT+2' :
    (location.timeZone === 108002) ?
      timeZoneShown = 'GMT+3' :
    (location.timeZone === 14400) ?
      timeZoneShown = 'GMT+4' :
    (location.timeZone === 18000) ?
      timeZoneShown = 'GMT+5' :
    (location.timeZone === 21600) ?
      timeZoneShown = 'GMT+6' :
    (location.timeZone === 25200) ?
      timeZoneShown = 'GMT+7' :
    (location.timeZone === 28800) ?
      timeZoneShown = 'GMT+8' :
    (location.timeZone === 32400) ?
      timeZoneShown = 'GMT+9' :
    (location.timeZone === 36000) ?
      timeZoneShown = 'GMT+10' :
    (location.timeZone === 39600) ?
      timeZoneShown = 'GMT+11' :   
    (location.timeZone === 43200) ?
      timeZoneShown = 'GMT+12' :
    (location.timeZone === 46800) ?
      timeZoneShown = 'GMT+13' : 
    (location.timeZone === 50400) ?
      timeZoneShown = 'GMT+14' :                 
    <></> 
    );

    ((weather.visibility < 50) ?
      visibilityDescription = 'Dense Fog' :
    (weather.visibility >= 50 && weather.visibility < 200) ?
      visibilityDescription = 'Thick Fog' :
    (weather.visibility >= 200 && weather.visibility < 500) ?
      visibilityDescription = 'Moderate Fog' :
    (weather.visibility >= 500 && weather.visibility < 1000) ?
      visibilityDescription = 'Light Fog' :
    (weather.visibility >= 1000 && weather.visibility < 2000) ?
      visibilityDescription = 'Thin Fog' :
    (weather.visibility >= 2000 && weather.visibility < 4000) ?
      visibilityDescription = 'Haze' :
    (weather.visibility >= 4000 && weather.visibility < 10000) ?
      visibilityDescription = 'Light Haze' :
    (weather.visibility === 10000) ?
      visibilityDescription = 'Clear' :
      <></>
    );

    var sunriseHourConversion = (
      String((location.timeZone <= 0) ? ((((times.sunriseHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600) : (Math.round((((times.sunriseHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600))).padStart(2, '0')
    );

    var sunsetHourConversion = (
      (location.timeZone <= 0) ? ((((times.sunsetHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600) : (Math.round(((times.sunsetHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600)
    );

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
                (weather.description === "haze") ?
                  <BsFillCloudHazeFill size={'200'} color={'white'} /> :
                <> </>}

              </section>
              <section className="text-lg">
                <p className="underline text-3xl font-bold">{location.name}, {location.country}</p>
                <p className="font-bold text-3xl mt-4">{weather.description.toUpperCase()}</p>
                <p className="mt-1">Temperature: {Math.round(weather.temperature)}°C</p>
                <p>Feels like: {Math.round(weather.tempFeel)}°C</p>
                <p>Max: {Math.round(weather.tempMax)}°C &emsp; Min: {Math.round(weather.tempMin)}°C</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Wind Speed: {weather.windSpeed} m/s &emsp; Wind Direction: {windDirection} @ {weather.windDegrees}°</p>
                <p>Pressure: {weather.pressure} hPa</p>
                <p>Visibility: {(weather.visibility >= 1000) ?
                  (weather.visibility / 1000) + 'km' :
                  (weather.visibility) + 'm'} ({visibilityDescription})
                </p>
                {console.log()}
                <p>Sunrise: {(sunriseHourConversion > 23) ? String(sunriseHourConversion - 24).padStart(2, '0') : sunriseHourConversion}:{times.sunriseMinute} ({timeZoneShown}) &emsp; Sunset: {(sunsetHourConversion < 0) ? (sunsetHourConversion + 24) : sunsetHourConversion}:{times.sunsetMinute} ({timeZoneShown})</p>
              </section><form onSubmit={handleSubmit}>
                <button type='submit' className="text-lg underline mt-5 font-bold">Show 3 hour weather</button>
              </form>
              <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
              <p className="absolute -bottom-12 right-2.5 underline">Last Updated: {times.timeUpdatedHour}:{times.timeUpdatedMinute}</p>
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
