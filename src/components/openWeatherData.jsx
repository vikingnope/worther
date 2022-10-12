import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
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
  
      history('/weather/' + city + '/' + lat + '/' + lon);
    }

    const [ name, setName ] = useState();
    const [ lat, setLat ] = useState();
    const [ lon, setLon ] = useState();
    const [ country, setCountry ] = useState();
    const [ humidity, setHumidity ] = useState();
    const [ temperature, setTemperature ] = useState();
    const [ tempMax, setTempMax ] = useState();
    const [ tempMin, setTempMin ] = useState();
    const [ tempFeel, setTempFeel ] = useState();
    const [ pressure, setPressure ] = useState();
    const [ mainWeather, setMainWeather ] = useState();
    const [ description, setDescription ] = useState('');
    const [ windSpeed, setWindSpeed ] = useState();
    const [ windDegrees, setWindDegrees ] = useState();
    const [ sunrise, setSunrise ] = useState();
    const [ sunset, setSunset ] = useState();
    const [ windDirection, setWindDirection ] = useState();
    const [ sunriseTime, setSunriseTime ] = useState({hour: undefined, minute: undefined});
    const [ sunsetTime, setSunsetTime ] = useState({hour: undefined, minute: undefined});
    const [ visibility, setVisibility ] = useState();
    const [ visibilityDescription, setVisibilityDescription ] = useState();
    const [ timeZone, setTimeZone ] = useState();
    const [ loaded, setLoaded ] = useState();
    const [ timeUpdatedUNIX, setTimeUpdatedUNIX ] = useState();
    const [ timeUpdated, setTimeUpdated ] = useState({hour: undefined, minute: undefined});

    sunriseTimeConversion = new Date(sunrise * 1000);
    sunsetTimeConversion = new Date(sunset * 1000);
    timeUpdatedConversion = new Date(timeUpdatedUNIX * 1000);

    document.title = "Worther - Weather - " + city;

    useEffect(() => {
      axios.get((countryCode === undefined && latitude === undefined && longitude === undefined) ?
      (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`) :
      (latitude === undefined && longitude === undefined) ?
      (`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${APIkey}&units=metric`) :
      (`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`))
      .then(response => {
        setName(response.data.name);
        setLat(response.data.coord.lat);
        setLon(response.data.coord.lon);
        setCountry(response.data.sys.country);
        setHumidity(response.data.main.humidity);
        setTemperature(response.data.main.temp);
        setTempMax(response.data.main.temp_max);
        setTempMin(response.data.main.temp_min);
        setTempFeel(response.data.main.feels_like);
        setPressure(response.data.main.pressure);
        setMainWeather(response.data.weather[0].main);
        setDescription(response.data.weather[0].description);
        setWindSpeed(response.data.wind.speed);
        setWindDegrees(response.data.wind.deg);
        setSunrise(response.data.sys.sunrise);
        setSunset(response.data.sys.sunset);
        setVisibility(response.data.visibility);
        setTimeUpdatedUNIX(response.data.dt);

        ((visibility < 50) ?
          setVisibilityDescription('Dense Fog') :
        (visibility >= 50 && visibility < 200) ?
          setVisibilityDescription('Thick Fog') :
        (visibility >= 200 && visibility < 500) ?
          setVisibilityDescription('Moderate Fog') :
        (visibility >= 500 && visibility < 1000) ?
          setVisibilityDescription('Light Fog') :
        (visibility >= 1000 && visibility < 2000) ?
          setVisibilityDescription('Thin Fog') :
        (visibility >= 2000 && visibility < 4000) ?
          setVisibilityDescription('Haze') :
        (visibility >= 4000 && visibility < 10000) ?
          setVisibilityDescription('Light Haze') :
        (visibility === 10000) ?
          setVisibilityDescription('Clear') :
          <></>
        );

        (((windDegrees >= 0 && windDegrees <= 11.25) || (windDegrees  > 348.75)) ? 
          setWindDirection('N')  : 
        (windDegrees >= 11.26 && windDegrees < 33.75) ?
          setWindDirection('NNE') :
        (windDegrees >= 33.75 && windDegrees < 56.25) ?
          setWindDirection('NE') :
        (windDegrees >= 56.25 && windDegrees < 78.75) ?
          setWindDirection('ENE') :
        (windDegrees >= 78.75 && windDegrees < 101.25) ?
          setWindDirection('E') :
        (windDegrees >= 101.25 && windDegrees < 123.75) ?
          setWindDirection('ESE') :
        (windDegrees >= 123.75 && windDegrees < 146.25) ?
          setWindDirection('SE') :
        (windDegrees >= 146.25 && windDegrees < 168.75) ?
          setWindDirection('SSE') :
        (windDegrees >= 168.75 && windDegrees < 191.25) ?
          setWindDirection('S') : 
        (windDegrees >= 191.25 && windDegrees < 213.75) ?
          setWindDirection('SSW') :
        (windDegrees >= 213.75 && windDegrees < 236.25) ?
          setWindDirection('SW') :
        (windDegrees >= 236.25 && windDegrees < 258.75) ?
          setWindDirection('WSW') :
        (windDegrees >= 258.75 && windDegrees < 281.25) ?
          setWindDirection('W') :
        (windDegrees >= 281.25 && windDegrees < 303.75) ?
          setWindDirection('WNW') :
        (windDegrees >= 303.75 && windDegrees < 326.25) ?
          setWindDirection('NW') :
        (windDegrees >= 326.25 && windDegrees < 348.75) ?
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
        
        const newSunriseTime = { 
          hour: String(sunriseTimeConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
          minute: String(sunriseTimeConversion.getMinutes()).padStart(2, '0')
        };
        setSunriseTime(newSunriseTime);

        const newSunsetTime = { 
          hour: String(sunsetTimeConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
          minute: String(sunsetTimeConversion.getMinutes()).padStart(2, '0')
        };
        setSunsetTime(newSunsetTime);

        const newUpdatedTime = { 
          hour: String(timeUpdatedConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
          minute: String(timeUpdatedConversion.getMinutes()).padStart(2, '0')
        };
        setTimeUpdated(newUpdatedTime);
        setLoaded(true);
      })
      .catch(error => {
        console.log(error);
        setLoaded(false);
      })
    }, []);

    return(
    <div className="text-white">
      <Header choice={'weather_city'}/>
      <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
        {(loaded) ?
          ((mainWeather) ?
            <>
              <section className="mx-auto mb-4">
                {(mainWeather === "Clear") ?
                  <BsFillSunFill size={'200'} color={'white'} /> :
                (description === "scattered clouds" || description === "broken clouds") ?
                  <BsFillCloudSunFill size={'200'} color={'white'} className="mb-0" /> :
                (description === "few clouds") ?
                  <AiFillCloud size={'200'} color={'white'} className="mb-0" /> :
                (description === "overcast clouds") ?
                  <BsFillCloudsFill size={'200'} color={'white'} className="mb-0" /> :
                (description === "light rain") ?
                  <BsFillCloudRainFill size={'200'} color={'white'} /> :
                (description === "heavy intensity rain" || description === "moderate rain") ?
                  <BsFillCloudRainHeavyFill size={'200'} color={'white'} /> :
                (mainWeather === "Drizzle") ?
                  <BsFillCloudDrizzleFill size={'200'} color={'white'} /> :
                (description === "thunderstorm with light rain") ?
                  <BsFillCloudLightningRainFill  size={'200'} color={'white'} className="mb-0" /> :
                (mainWeather === "Fog") ?
                  <BsCloudFog size={'200'} color={'white'} /> :
                (mainWeather === "Snow") ?
                  <BsFillCloudSnowFill size={'200'} color={'white'} /> :
                <> </>}

              </section>
              <section className="text-lg">
                <p className="underline text-3xl font-bold">{name}, {country}</p>
                <p className="font-bold text-3xl mt-4">{description.toUpperCase()}</p>
                <p className="mt-1">Temperature: {Math.round(temperature)}°C</p>
                <p>Feels like: {Math.round(tempFeel)}°C</p>
                <p>Max: {Math.round(tempMax)}°C &emsp; Min: {Math.round(tempMin)}°C</p>
                <p>Humidity: {humidity}%</p>
                <p>Wind Speed: {windSpeed} m/s &emsp; Wind Direction: {windDirection} @ {windDegrees}°</p>
                <p>Pressure: {pressure} hPa</p>
                <p>Visibility: {(visibility >= 1000) ?
                  (visibility / 1000) + 'km' :
                  (visibility) + 'm'} ({visibilityDescription})
                </p>
                <p>Sunrise: {sunriseTime.hour}:{sunriseTime.minute} ({timeZone}) &emsp; Sunset: {sunsetTime.hour}:{sunsetTime.minute} ({timeZone})</p>
              </section><form onSubmit={handleSubmit}>
                <button type='submit' className="text-lg underline mt-5 font-bold">Show 5 day weather</button>
              </form>
              <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
              <p className="absolute bottom-0 right-1.5 underline">Last Updated: {timeUpdated.hour}:{timeUpdated.minute}</p>
          </> :
          <>
            <p className="text-3xl uppercase font-bold">The city you have entered ('{city}') has not been found</p>
            <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
          </>
          ) :
          (loaded === false && !mainWeather) ?
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
