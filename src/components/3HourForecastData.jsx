import {useEffect, useState, useMemo, useCallback, memo } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './utils/header';
import { Footer } from './utils/footer';
import { TimeZoneShow, WeatherIcons, WindDirection, VisibilityDesc, WindForce, SunriseSunsetTimes } from './utils/weatherVariables';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

export const ThreeHourForecastData = memo(() => {
  const { lat, lon } = useParams();

  const [ location, setLocation ] = useState([]);
  const [ weather, setWeather ] = useState([]);
  const [ times, setTimes ] = useState([]);
  const isDesktopView = useDeviceDetect();
  const [ loading, setLoading ] = useState(true);

  const history = useNavigate();

  const handleSubmit = useCallback((e, index) => {
    e.preventDefault();

    history('/Single3HourForecast/' + index + '/' + location.lat + '/' + location.lon);
  }, [history, location.lat, location.lon]);

  useEffect(() => {
    document.title = "Worther - 3 Hour Weather - " + location.name;
  }, [location.name]);

  useEffect(() => {
    if (!loading) return;
    
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`
        );
        
        // Process all weather data at once instead of updating state in a loop
        const weatherData = response.data.list.map(weatherAPI => ({
          humidity: weatherAPI.main.humidity,
          temperature: weatherAPI.main.temp,
          tempFeel: weatherAPI.main.feels_like,
          pressure: weatherAPI.main.pressure,
          mainWeather: weatherAPI.weather[0].main,
          description: weatherAPI.weather[0].description,
          windSpeed: weatherAPI.wind.speed,
          windDegrees: weatherAPI.wind.deg,
          precipitation: (weatherAPI.pop * 100),
          visibility: weatherAPI.visibility,
          dayUNIX: ((weatherAPI.dt) * 1000),
          timeNormalHour: String((new Date((weatherAPI.dt) * 1000)).getHours()).padStart(2, '0'),
          timeNormalMinutes: String((new Date((weatherAPI.dt) * 1000)).getMinutes()).padStart(2, '0')
        }));
        
        // Set all weather data in a single update
        setWeather(weatherData);
        
        setLocation({
          name: response.data.city.name,
          country: response.data.city.country,
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon,
          timeZone: response.data.city.timezone
        });
        
        setTimes({
          sunrise: response.data.city.sunrise,
          sunset: response.data.city.sunset,
          timeZone: response.data.city.timezone
        });
        
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [lat, lon, loading]);

  // Group weather data by day using useMemo for better performance
  const groupedWeatherByDay = useMemo(() => {
    const grouped = {};
    
    weather.forEach((item, index) => {
      const day = new Date((item.dayUNIX + (location.timeZone * 1000)) + ((new Date().getTimezoneOffset() * 60) * 1000)).toDateString();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({ ...item, index });
    });
    
    return grouped;
  }, [weather, location.timeZone]); // Only recalculate when these dependencies change

  const localSunriseSunsetTimes = useMemo(() => {
    if (times && times.sunrise && times.sunset && times.timeZone !== undefined) {
      return SunriseSunsetTimes(times);
    }
    return null;
  }, [times]);

  return (
    <div className='text-white overflow-hidden flex flex-col min-h-screen bg-black'>
      <Header/>
      <div className="text-center text-white flex-grow flex flex-col">
          <p className='text-3xl font-bold my-5 underline lg:text-4xl'>3 Hour Forecast Data - {location.name}</p>
          {(weather.length > 0) ? (
            Object.entries(groupedWeatherByDay).map(([day, dayWeather]) => (
              <div key={day} className="mb-4">
                <h2 className="text-3xl font-bold py-3 bg-neutral-800 border-b-2">{day}</h2>
                {dayWeather.map((weather) => {
                  const hourConversion = Math.round((((weather.timeNormalHour * 3600) + (new Date().getTimezoneOffset() * 60)) + location.timeZone) / 3600);
                  return (
                    <button
                      aria-label={`Weather forecast for ${day} at ${(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:${weather.timeNormalMinutes}, ${weather.description}`}
                      key={weather.index} 
                      onClick={(e) => handleSubmit(e, weather.index)} 
                      className='duration-300 hover:cursor-pointer hover:text-4xl hover:bg-cyan-800 lg:flex-row flex flex-col border-b-2 text-white h-fit w-screen'
                    >
                      <span className="lg:ml-5 mx-auto mt-5 lg:my-auto lg:mr-7">
                        <WeatherIcons mainWeather={weather.mainWeather} windSpeed={weather.windSpeed} description={weather.description} timeZone={times.timeZone} sunriseHour={localSunriseSunsetTimes.sunriseHour} sunsetHour={localSunriseSunsetTimes.sunsetHour} hourConversion={hourConversion} page={isDesktopView ? 'multiple' : 'multiple-mobile'}/>
                      </span>
                      <span className='lg:my-3.5 font-bold text-xl lg:mr-10 mt-5 mx-auto'>{(hourConversion > 23) ? String(hourConversion - 24).padStart(2, '0') : (hourConversion < 0) ? (hourConversion + 24) : String(hourConversion).padStart(2, '0')}:{weather.timeNormalMinutes} ({<TimeZoneShow timeZone={location.timeZone}/>})</span>
                      <span className='lg:my-3 lg:mr-10 font-bold text-2xl mt-5 mx-auto'>{weather.description.toUpperCase()}</span>
                      <span className='lg:my-3 lg:mr-9 text-xl mt-5 mx-auto'>Temp: {Math.round(weather.temperature)}°C</span>
                      <span className='lg:my-3 lg:mr-9 text-xl mt-5 mx-auto'>Wind Speed: {weather.windSpeed} m/s ({<WindForce windSpeed={weather.windSpeed} />})&ensp; Wind Direction: {<WindDirection windDegrees={weather.windDegrees}/>} @ {weather.windDegrees}°</span>
                      <span className='lg:my-3 lg:mr-9 text-xl mt-5 mx-auto'>Precipitation: {Math.round(weather.precipitation)}%</span>
                      <span className='lg:my-3 lg:mr-9 text-xl my-5 mx-auto'>Visibility: {(weather.visibility >= 1000) ?
                        (weather.visibility / 1000) + 'km' :
                        (weather.visibility) + 'm'} ({<VisibilityDesc visibility={weather.visibility}/>})
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <></>
          )}
      </div>
      <Footer />
    </div>
  )
});

ThreeHourForecastData.displayName = 'ThreeHourForecastData';