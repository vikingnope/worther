import {useEffect, useState} from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { TimeZoneShow, WeatherIcons, WindDirection, VisibilityDesc } from './utils/weatherVariables';

var sunriseTimeConversion;
var sunsetTimeConversion;
var timeUpdatedConversion; 

export const SingleThreeHourWeatherData = () => {
  const { city, lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ date, setDate ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ loaded, setLoaded ] = useState();
  const [ sunriseTime, setSunriseTime ] = useState([]);
  const [ sunsetTime, setSunsetTime ] = useState([]);
  const [ timeUpdated, setTimeUpdated ] = useState([]);

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    history('/weather/' +  location.name + '/' + location.lat + '/' + location.lon);
  }

  var times = {};

  // timeUpdatedConversion = new Date(timeUpdatedUNIX * 1000);

  document.title = "Worther - 5 Day Weather - " + location.name;

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)    
    .then(response => {
      console.log(response.data);
      for (let i = 0; i < response.data.list.length; i++){
        const weatherObj = {
          humidity: response.data.list[i].main.humidity,
          temperature: response.data.list[i].main.temp,
          tempMax: response.data.list[i].main.temp_max,
          tempMin: response.data.list[i].main.temp_min,
          tempFeel: response.data.list[i].main.feels_like,
          pressure: response.data.list[i].main.pressure,
          mainWeather: response.data.list[i].weather[0].main,
          description: response.data.list[i].weather[0].description,
          windSpeed: response.data.list[i].wind.speed,
          windDegrees: response.data.list[i].wind.deg,
          visibility: response.data.list[i].visibility,
          dayUNIX: ((response.data.list[i].dt) * 1000),
          timeNormalHour: String((new Date((response.data.list[i].dt) * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
          timeNormalMinutes: String((new Date((response.data.list[i].dt) * 1000)).getMinutes()).padStart(2, '0')
        }
        setWeather(weather => [...weather, weatherObj])
      }

      const locationObj = {
        name: response.data.city.name,
        country: response.data.city.country,
        timeZone: response.data.city.timezone
      }
      setLocation(locationObj)

      var date = new Date(weather.timeUNIX * 1000);

      const dateObj = {
        day: String(date.getDay()).padStart(2, '0'),
        month: String(date.getMonth()).padStart(2, '0'),
        year: String(date.getFullYear())
      }
      setDate(dateObj);

      setLoaded(true);
    })
    .catch(error => {
      console.log(error);
      setLoaded(false);
    })
  }, []);

  var hourConversion = '';
  var dayConversion = '';

  return (
    <div className='select-none text-white'>
      <Header choice='showWeather'/>
      <div className="text-center select-none bg-black text-white min-h-screen flex flex-col">
          <p className='text-4xl font-bold my-5'>Single 3 Hour Weather Data (In Progress)</p>
      </div>
      <Footer />
    </div>
  )
}