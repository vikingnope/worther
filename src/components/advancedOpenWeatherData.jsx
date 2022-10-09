import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header } from "./utils/header";
import { Footer } from "./utils/footer";
import { BsFillSunFill } from 'react-icons/bs'; // sunny
import { AiFillCloud } from 'react-icons/ai'; // cloudy
import { BsFillCloudRainFill } from 'react-icons/bs'; // rain
import { BsFillCloudLightningRainFill } from 'react-icons/bs'; // thunder and rain
import { BsFillCloudSnowFill } from 'react-icons/bs'; // snow
import { BsCloudFog } from 'react-icons/bs'; // fog


export const GetAdvancedOpenWeatherData = () => {

    const { countryCode, city } = useParams(); // Gets city from the url

    const [ name, setName ] = useState();
    const [ country, setCountry ] = useState();
    const [ humidity, setHumidity ] = useState();
    const [ temperature, setTemperature ] = useState();
    const [ tempMax, setTempMax ] = useState();
    const [ tempMin, setTempMin ] = useState();
    const [ tempFeel, setTempFeel ] = useState();
    const [ pressure, setPressure ] = useState();
    const [ mainWeather, setMainWeather ] = useState();
    const [ description, setDescription ] = useState();
    const [ windSpeed, setWindSpeed ] = useState();
    const [ windDegrees, setWindDegrees ] = useState();
    const [ sunrise, setSunrise ] = useState();
    const [ sunset, setSunset ] = useState();
    const [ windDirection, setWindDirection ] = useState();
    const [ sunriseHour, setSunriseHour ] = useState();
    const [ sunriseMinute, setSunriseMinute ] = useState();
    const [ sunsetHour, setSunsetHour ] = useState();
    const [ sunsetMinute, setSunsetMinute ] = useState();
    const [ timeZone, setTimeZone ] = useState();

    var sunriseTime = new Date(sunrise * 1000);
    var sunsetTime = new Date(sunset * 1000);

    document.title = "Worther - Weather - " + city;
  
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)
      .then(response => {
        setName(response.data.name);
        setCountry(response.data.sys.country);
        setHumidity(response.data.main.humidity);
        setTemperature(response.data.main.temp);
        setTempMax(response.data.main.temp_max);
        setTempMin(response.data.main.temp_max);
        setTempFeel(response.data.main.feels_like);
        setPressure(response.data.main.pressure);
        setMainWeather(response.data.weather[0].main);
        setDescription(response.data.weather[0].description);
        setWindSpeed(response.data.wind.speed);
        setWindDegrees(response.data.wind.deg);
        setSunrise(response.data.sys.sunrise);
        setSunset(response.data.sys.sunset);

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

        ((sunriseTime.getTimezoneOffset() === 0) ?
          setTimeZone('GMT') :
        (sunriseTime.getTimezoneOffset() === 60) ?
          setTimeZone('GMT-1') :
        (sunriseTime.getTimezoneOffset() === 120) ?
          setTimeZone('GMT-2') :
        (sunriseTime.getTimezoneOffset() === 180) ?
          setTimeZone('GMT-3') :
        (sunriseTime.getTimezoneOffset() === 240) ?
          setTimeZone('GMT-4') :
        (sunriseTime.getTimezoneOffset() === 300) ?
          setTimeZone('GMT-5') :
        (sunriseTime.getTimezoneOffset() === 360) ?
          setTimeZone('GMT-6') :
        (sunriseTime.getTimezoneOffset() === 420) ?
          setTimeZone('GMT-7') :
        (sunriseTime.getTimezoneOffset() === 480) ?
          setTimeZone('GMT-8') :
        (sunriseTime.getTimezoneOffset() === 540) ?
          setTimeZone('GMT-9') :
        (sunriseTime.getTimezoneOffset() === 600) ?
          setTimeZone('GMT-10') :
        (sunriseTime.getTimezoneOffset() === 660) ?
          setTimeZone('GMT-11') :
        (sunriseTime.getTimezoneOffset() === 720) ?
          setTimeZone('GMT-12') :
        (sunriseTime.getTimezoneOffset() === -60) ?
          setTimeZone('GMT+1') :
        (sunriseTime.getTimezoneOffset() === -120) ?
          setTimeZone('GMT+2') :
        (sunriseTime.getTimezoneOffset() === -180) ?
          setTimeZone('GMT+3') :
        (sunriseTime.getTimezoneOffset() === -240) ?
          setTimeZone('GMT+4') :
        (sunriseTime.getTimezoneOffset() === -300) ?
          setTimeZone('GMT+5') :
        (sunriseTime.getTimezoneOffset() === -360) ?
          setTimeZone('GMT+6') :
        (sunriseTime.getTimezoneOffset() === -420) ?
          setTimeZone('GMT+7') :
        (sunriseTime.getTimezoneOffset() === -480) ?
          setTimeZone('GMT+8') :
        (sunriseTime.getTimezoneOffset() === -540) ?
          setTimeZone('GMT+9') :
        (sunriseTime.getTimezoneOffset() === -600) ?
          setTimeZone('GMT+10') :
        (sunriseTime.getTimezoneOffset() === -660) ?
          setTimeZone('GMT+11') :   
        (sunriseTime.getTimezoneOffset() === -720) ?
          setTimeZone('GMT+12') :
        (sunriseTime.getTimezoneOffset() === -780) ?
          setTimeZone('GMT+13') : 
        (sunriseTime.getTimezoneOffset() === -840) ?
          setTimeZone('GMT+14') :                 
        <></> 
        );
        
        
        setSunriseHour(String(sunriseTime.getHours()).padStart(2, '0'));
        setSunriseMinute(String(sunriseTime.getMinutes()).padStart(2, '0')); // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
        setSunsetHour(String(sunsetTime.getHours()).padStart(2, '0'));
        setSunsetMinute(String(sunsetTime.getMinutes()).padStart(2, '0'));
      });

    return(
      <div className="text-center select-none bg-black text-white min-h-screen flex flex-col justify-center">
        <Header choice={'weather_city'}/>
        <section className="mx-auto">
          { 
            (mainWeather === "Clear") ?
              <BsFillSunFill size = {'200'} color = {'white'} /> :
            (mainWeather === "Clouds") ?
              <AiFillCloud size = {'200'} color = {'white'} /> :
            (mainWeather === "Rain") ?
              <BsFillCloudRainFill size = {'200'} color = {'white'} /> :  
            (mainWeather === "Fog") ?
              <BsCloudFog size = {'200'} color = {'white'} /> :  
            (mainWeather === "Snow") ?
              <BsFillCloudSnowFill size = {'200'} color = {'white'} /> :  
            <> </>
          }
          
        </section>
        <section className="text-base">
          <p className="text-2xl font-bold">{city}, {country}</p>
          <p>{mainWeather}</p>
          <p>Temperature: {Math.round(temperature)}°C</p>
          <p>Feels like: {Math.round(tempFeel)}°C</p>
          <p>Max: {Math.round(tempMax)}°C &emsp; Min: {Math.round(tempMin)}°C</p>
          <p>Humidity: {humidity}%</p>
          <p>Wind Speed: {windSpeed} m/s &emsp; Wind Direction: {windDirection} @ {windDegrees}°</p>
          <p>Pressure: {pressure} hPa</p>
          <p>Sunrise: {sunriseHour}:{sunriseMinute} ({timeZone}) &emsp; Sunset: {sunsetHour}:{sunsetMinute} ({timeZone})</p>
        </section>
        <Footer />
      </div>
    )  
  };