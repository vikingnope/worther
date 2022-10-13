import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

var sunriseTimeConversion;
var sunsetTimeConversion;
var timeUpdatedConversion; 

export const MultipleWeatherData = () => {
  const { city, lat, lon } = useParams();

  const [ name, setName ] = useState();
  const [ country, setCountry ] = useState();
  const [ timeUNIX, setTimeUNIX ] = useState();
  const [ day, setDay ] = useState();
  const [ month, setMonth ] = useState();
  const [ year, setYear ] = useState();
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
  const [ visibility, setVisibility ] = useState();
  const [ visibilityDescription, setVisibilityDescription ] = useState();
  const [ timeZone, setTimeZone ] = useState();
  const [ loaded, setLoaded ] = useState();
  const [ timeUpdatedUNIX, setTimeUpdatedUNIX ] = useState();
  const [ sunriseTime, setSunriseTime ] = useState({hour: undefined, minute: undefined});
  const [ sunsetTime, setSunsetTime ] = useState({hour: undefined, minute: undefined});
  const [ timeUpdated, setTimeUpdated ] = useState({hour: undefined, minute: undefined});

  // sunriseTimeConversion = new Date(sunrise * 1000);
  // sunsetTimeConversion = new Date(sunset * 1000);
  // timeUpdatedConversion = new Date(timeUpdatedUNIX * 1000);

  document.title = "Worther - 5 Day Weather - " + city;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)    
    .then(response => {
      console.log(response.data);
      setName(response.data.city.name);
      setCountry(response.data.city.country);
      setTimeUNIX(response.data.list[0].dt);
      setHumidity(response.data.list[0].main.humidity);
      setTemperature(response.data.list[0].main.temp);
      setTempMax(response.data.list[0].main.temp_max);
      setTempMin(response.data.list[0].main.temp_max);
      setTempFeel(response.data.list[0].main.feels_like);
      setPressure(response.data.list[0].main.pressure);
      setMainWeather(response.data.list[0].weather[0].main);
      setDescription(response.data.list[0].weather[0].description);
      setWindSpeed(response.data.list[0].wind.speed);
      setWindDegrees(response.data.list[0].wind.deg);
      setSunrise(response.data.city.sunrise);
      setSunset(response.data.city.sunset);
      setVisibility(response.data.list[0].visibility);
      // setTimeUpdatedUNIX(response.data.dt);

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

      var date = new Date(timeUNIX * 1000);

      setDay(String(date.getDay()).padStart(2, '0'));
      setMonth(String(date.getMonth()).padStart(2, '0'));
      setYear(String(date.getFullYear()));

      // const newSunriseTime = { 
      //   hour: String(sunriseTimeConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
      //   minute: String(sunriseTimeConversion.getMinutes()).padStart(2, '0')
      // };
      // setSunriseTime(newSunriseTime);

      // const newSunsetTime = { 
      //   hour: String(sunsetTimeConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
      //   minute: String(sunsetTimeConversion.getMinutes()).padStart(2, '0')
      // };
      // setSunsetTime(newSunsetTime);

      // const newUpdatedTime = { 
      //   hour: String(timeUpdatedConversion.getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
      //   minute: String(timeUpdatedConversion.getMinutes()).padStart(2, '0')
      // };
      // setTimeUpdated(newUpdatedTime);
      setLoaded(true);
    })
    .catch(error => {
      console.log(error);
      setLoaded(false);
    })
  }, [!timeUpdated.hour]);

  return (
    <div className="text-center select-none bg-black text-white min-h-screen flex flex-col justify-center">
        <p>5 Day Weather Data</p>
    </div>
  )
}