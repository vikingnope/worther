import axios from "axios";
import { useState } from "react";
import { AiOutlineClose } from 'react-icons/ai';

const Data = () => {
  const [ name, setName ] = useState();
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
};
 
export const OpenWeatherMapData = (city) => {

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)
    .then(response => {
      console.log(response.data);
      // Data.setName(response.data.main.name);
      // console.log(Data.name);
    });

  return(
    <div className="relative leaflet-top leaflet-right">
        <div className="w-20 h-32 bg-black z-50 block">
          
        </div>
    </div>
  )
};