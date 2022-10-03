import { useState } from "react";
import axios from "axios";

export const GetOpenWeatherData = (city) => {
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
  
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)
      .then(response => {
        console.log(response.data);
        setName(response.data.main.name);
        console.log(name);
      });
  };