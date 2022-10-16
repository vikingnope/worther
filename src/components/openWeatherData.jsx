import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "./utils/header";
import { Footer } from "./utils/footer";
import { TimeZoneShow, VisibilityDesc, WindDirection } from "./utils/weatherVariables";
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
import { TbMist } from 'react-icons/tb'; // mist

export const GetOpenWeatherData = () => {

    var times = {};

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

    (times = {
      sunriseHour: String((new Date(weather.sunrise * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
      sunriseMinute: String((new Date(weather.sunrise * 1000)).getMinutes()).padStart(2, '0'),
      sunsetHour: String((new Date(weather.sunset * 1000)).getHours()).padStart(2, '0'),
      sunsetMinute: String((new Date(weather.sunset * 1000)).getMinutes()).padStart(2, '0'),
      timeUpdatedHour: String((new Date(weather.timeUpdatedUNIX * 1000)).getHours()).padStart(2, '0'),
      timeUpdatedMinute: String((new Date(weather.timeUpdatedUNIX * 1000)).getMinutes()).padStart(2, '0')
    });

    var sunriseHourConversion = (
      Math.round((((times.sunriseHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600)
    );

    var sunsetHourConversion = (
      Math.round((((times.sunsetHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600)
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
                (weather.description === "mist") ?
                  <TbMist size={'200'} color={'white'} /> :
                <> </>}

              </section>
              <section className="text-lg">
                <p className="underline text-3xl font-bold">{location.name}, {location.country}</p>
                <p className="font-bold text-3xl mt-4">{weather.description.toUpperCase()}</p>
                <p className="mt-1">Temperature: {Math.round(weather.temperature)}°C</p>
                <p>Feels like: {Math.round(weather.tempFeel)}°C</p>
                <p>Max: {Math.round(weather.tempMax)}°C &emsp; Min: {Math.round(weather.tempMin)}°C</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Wind Speed: {weather.windSpeed} m/s &emsp; Wind Direction: {<WindDirection windDegrees={weather.windDegrees}/>} @ {weather.windDegrees}°</p>
                <p>Pressure: {weather.pressure} hPa</p>
                <p>Visibility: {(weather.visibility >= 1000) ?
                  (weather.visibility / 1000) + 'km' :
                  (weather.visibility) + 'm'} ({<VisibilityDesc visibility={weather.visibility}/>})
                </p>
                <p>Sunrise: {(sunriseHourConversion > 23) ? String(sunriseHourConversion - 24).padStart(2, '0') : String(sunriseHourConversion).padStart(2, '0')}:{times.sunriseMinute} ({<TimeZoneShow timeZone={location.timeZone}/>}) &emsp; Sunset: {(sunsetHourConversion < 0) ? (sunsetHourConversion + 24) : sunsetHourConversion}:{times.sunsetMinute} ({<TimeZoneShow timeZone={location.timeZone}/>})</p>
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
