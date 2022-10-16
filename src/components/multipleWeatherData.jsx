import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
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

var sunriseTimeConversion;
var sunsetTimeConversion;
var timeUpdatedConversion; 

export const MultipleWeatherData = () => {
  const { city, lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ date, setDate ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ loaded, setLoaded ] = useState();
  const [ sunriseTime, setSunriseTime ] = useState([]);
  const [ sunsetTime, setSunsetTime ] = useState([]);
  const [ timeUpdated, setTimeUpdated ] = useState([]);

  var times = {};

  // sunriseTimeConversion = new Date(sunrise * 1000);
  // sunsetTimeConversion = new Date(sunset * 1000);
  // timeUpdatedConversion = new Date(timeUpdatedUNIX * 1000);

  document.title = "Worther - 5 Day Weather - " + location.name;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)    
    .then(response => {
      console.log(response.data);
      for (let i = 0; i < response.data.list.length; i++){

        const weatherObj = {
          // timeUNIX: response.data.list[i].dt,
          humidity: response.data.list[i].main.humidity,
          temperature: response.data.list[i].main.temp,
          tempMax: response.data.list[i].main.temp_max,
          tempMin: response.data.list[i].main.temp_max,
          tempFeel: response.data.list[i].main.feels_like,
          pressure: response.data.list[i].main.pressure,
          mainWeather: response.data.list[i].weather[0].main,
          description: response.data.list[i].weather[0].description,
          windSpeed: response.data.list[i].wind.speed,
          windDegrees: response.data.list[i].wind.deg,
          visibility: response.data.list[i].visibility,
          day: ((new Date((response.data.list[i].dt) * 1000)).toDateString()),
          timeNormalHour: String((new Date((response.data.list[i].dt) * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
          timeNormalMinutes: String((new Date((response.data.list[i].dt) * 1000)).getMinutes()).padStart(2, '0')
        }
        // console.log(weatherObj)
        setWeather(weather => [...weather, weatherObj])
      }

      const locationObj = {
        name: response.data.city.name,
        country: response.data.city.country,
        sunrise:response.data.city.sunrise,
        sunset: response.data.city.sunset
      }
      setLocation(locationObj)

      // setTimeUpdatedUNIX(response.data.dt);

      // ((visibility < 50) ?
      //   setVisibilityDescription('Dense Fog') :
      // (visibility >= 50 && visibility < 200) ?
      //   setVisibilityDescription('Thick Fog') :
      // (visibility >= 200 && visibility < 500) ?
      //   setVisibilityDescription('Moderate Fog') :
      // (visibility >= 500 && visibility < 1000) ?
      //   setVisibilityDescription('Light Fog') :
      // (visibility >= 1000 && visibility < 2000) ?
      //   setVisibilityDescription('Thin Fog') :
      // (visibility >= 2000 && visibility < 4000) ?
      //   setVisibilityDescription('Haze') :
      // (visibility >= 4000 && visibility < 10000) ?
      //   setVisibilityDescription('Light Haze') :
      // (visibility === 10000) ?
      //   setVisibilityDescription('Clear') :
      //   <></>
      // );

      // (((windDegrees >= 0 && windDegrees <= 11.25) || (windDegrees  > 348.75)) ? 
      //   setWindDirection('N')  : 
      // (windDegrees >= 11.26 && windDegrees < 33.75) ?
      //   setWindDirection('NNE') :
      // (windDegrees >= 33.75 && windDegrees < 56.25) ?
      //   setWindDirection('NE') :
      // (windDegrees >= 56.25 && windDegrees < 78.75) ?
      //   setWindDirection('ENE') :
      // (windDegrees >= 78.75 && windDegrees < 101.25) ?
      //   setWindDirection('E') :
      // (windDegrees >= 101.25 && windDegrees < 123.75) ?
      //   setWindDirection('ESE') :
      // (windDegrees >= 123.75 && windDegrees < 146.25) ?
      //   setWindDirection('SE') :
      // (windDegrees >= 146.25 && windDegrees < 168.75) ?
      //   setWindDirection('SSE') :
      // (windDegrees >= 168.75 && windDegrees < 191.25) ?
      //   setWindDirection('S') : 
      // (windDegrees >= 191.25 && windDegrees < 213.75) ?
      //   setWindDirection('SSW') :
      // (windDegrees >= 213.75 && windDegrees < 236.25) ?
      //   setWindDirection('SW') :
      // (windDegrees >= 236.25 && windDegrees < 258.75) ?
      //   setWindDirection('WSW') :
      // (windDegrees >= 258.75 && windDegrees < 281.25) ?
      //   setWindDirection('W') :
      // (windDegrees >= 281.25 && windDegrees < 303.75) ?
      //   setWindDirection('WNW') :
      // (windDegrees >= 303.75 && windDegrees < 326.25) ?
      //   setWindDirection('NW') :
      // (windDegrees >= 326.25 && windDegrees < 348.75) ?
      //   setWindDirection('NNW') :                          
      // <> </>);

      // ((sunriseTime.getTimezoneOffset() === 0) ?
      //   setTimeZone('GMT') :
      // (sunriseTime.getTimezoneOffset() === 60) ?
      //   setTimeZone('GMT-1') :
      // (sunriseTime.getTimezoneOffset() === 120) ?
      //   setTimeZone('GMT-2') :
      // (sunriseTime.getTimezoneOffset() === 180) ?
      //   setTimeZone('GMT-3') :
      // (sunriseTime.getTimezoneOffset() === 240) ?
      //   setTimeZone('GMT-4') :
      // (sunriseTime.getTimezoneOffset() === 300) ?
      //   setTimeZone('GMT-5') :
      // (sunriseTime.getTimezoneOffset() === 360) ?
      //   setTimeZone('GMT-6') :
      // (sunriseTime.getTimezoneOffset() === 420) ?
      //   setTimeZone('GMT-7') :
      // (sunriseTime.getTimezoneOffset() === 480) ?
      //   setTimeZone('GMT-8') :
      // (sunriseTime.getTimezoneOffset() === 540) ?
      //   setTimeZone('GMT-9') :
      // (sunriseTime.getTimezoneOffset() === 600) ?
      //   setTimeZone('GMT-10') :
      // (sunriseTime.getTimezoneOffset() === 660) ?
      //   setTimeZone('GMT-11') :
      // (sunriseTime.getTimezoneOffset() === 720) ?
      //   setTimeZone('GMT-12') :
      // (sunriseTime.getTimezoneOffset() === -60) ?
      //   setTimeZone('GMT+1') :
      // (sunriseTime.getTimezoneOffset() === -120) ?
      //   setTimeZone('GMT+2') :
      // (sunriseTime.getTimezoneOffset() === -180) ?
      //   setTimeZone('GMT+3') :
      // (sunriseTime.getTimezoneOffset() === -240) ?
      //   setTimeZone('GMT+4') :
      // (sunriseTime.getTimezoneOffset() === -300) ?
      //   setTimeZone('GMT+5') :
      // (sunriseTime.getTimezoneOffset() === -360) ?
      //   setTimeZone('GMT+6') :
      // (sunriseTime.getTimezoneOffset() === -420) ?
      //   setTimeZone('GMT+7') :
      // (sunriseTime.getTimezoneOffset() === -480) ?
      //   setTimeZone('GMT+8') :
      // (sunriseTime.getTimezoneOffset() === -540) ?
      //   setTimeZone('GMT+9') :
      // (sunriseTime.getTimezoneOffset() === -600) ?
      //   setTimeZone('GMT+10') :
      // (sunriseTime.getTimezoneOffset() === -660) ?
      //   setTimeZone('GMT+11') :   
      // (sunriseTime.getTimezoneOffset() === -720) ?
      //   setTimeZone('GMT+12') :
      // (sunriseTime.getTimezoneOffset() === -780) ?
      //   setTimeZone('GMT+13') : 
      // (sunriseTime.getTimezoneOffset() === -840) ?
      //   setTimeZone('GMT+14') :                 
      // <></> 
      // );

      var date = new Date(weather.timeUNIX * 1000);

      const dateObj = {
        day: String(date.getDay()).padStart(2, '0'),
        month: String(date.getMonth()).padStart(2, '0'),
        year: String(date.getFullYear())
      }
      setDate(dateObj);

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
    <div className='select-none text-white'>
      <Header choice='showWeather'/>
      <div className="text-center select-none bg-black text-white min-h-screen flex flex-col">
          <p className='text-4xl font-bold my-5'>3 Hour Weather Data</p>
          {(weather.length > 0) ?
            (
              weather.map((weather, index) => ( // .map is used instead of loops
                <div key={index} className='flex border-y-2 text-white'>
                  <section className="ml-10 my-1.5 mr-20">
                    {(weather.mainWeather === "Clear") ?
                      <BsFillSunFill size={'50'} color={'white'} /> :
                    (weather.description === "scattered clouds" || weather.description === "broken clouds") ?
                      <BsFillCloudSunFill size={'50'} color={'white'} className="mb-0" /> :
                    (weather.description === "few clouds") ?
                      <AiFillCloud size={'50'} color={'white'} className="mb-0" /> :
                    (weather.description === "overcast clouds") ?
                      <BsFillCloudsFill size={'50'} color={'white'} className="mb-0" /> :
                    (weather.description === "light rain") ?
                      <BsFillCloudRainFill size={'50'} color={'white'} /> :
                    (weather.description === "heavy intensity rain" || weather.description === "moderate rain") ?
                      <BsFillCloudRainHeavyFill size={'50'} color={'white'} /> :
                    (weather.mainWeather === "Drizzle") ?
                      <BsFillCloudDrizzleFill size={'50'} color={'white'} /> :
                    (weather.description === "thunderstorm with light rain") ?
                      <BsFillCloudLightningRainFill  size={'50'} color={'white'} className="mb-0" /> :
                    (weather.mainWeather === "Fog") ?
                      <BsCloudFog size={'50'} color={'white'} /> :
                    (weather.mainWeather === "Snow") ?
                      <BsFillCloudSnowFill size={'50'} color={'white'} /> :
                    (weather.description === "haze") ?
                      <BsFillCloudHazeFill size={'50'} color={'white'} /> :
                    <> </>}
                  </section>
                  <p className='my-3.5 mr-7 font-bold text-xl'>{weather.day}</p>
                  <p className='my-3.5 font-bold text-xl mr-10'>{weather.timeNormalHour} : {weather.timeNormalMinutes} (GMT+2)</p>
                  <p className='my-3 mr-10 font-bold text-2xl'>{weather.description.toUpperCase()}</p>
                </div>
              ))
            ) :
            <></>
          }
      </div>
      <Footer />
    </div>
  )
}