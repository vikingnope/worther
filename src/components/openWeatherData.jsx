import { useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Header } from "./utils/header";
import { Footer } from "./utils/footer";

export const GetOpenWeatherData = () => {

    const {city} = useParams() // Gets city from the url

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

    document.title = "Worther - Weather - " + city;
  
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=45245b26fa062bdd9ca60efac28d1c01&units=metric`)
      .then(response => {
        console.log(response.data);
        setName(response.data.name);
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
      });

    return(
      <div className="text-center select-none bg-black text-white min-h-screen flex flex-col justify-center">
        <Header choice={'weather_city'}/>
        <div>

        </div>
        <Footer />
      </div>
    )  
  };