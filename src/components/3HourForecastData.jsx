import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

import {
  TimeZoneShow,
  SunriseSunsetTimes,
  VisibilityDesc,
  WindDirection,
  WindForce,
} from '@components/weather/helpers/weatherHelpers';
import { WeatherIcons, WindArrow } from '@components/weather/WeatherIcons';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

export function ThreeHourForecastData() {
  const { lat, lon } = useParams();

  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState([]);
  const [times, setTimes] = useState({});
  const isDesktopView = useDeviceDetect();
  const [loading, setLoading] = useState(true);

  const history = useNavigate();

  function handleNavigateBack() {
    // Go back to single weather page with current location
    if (location.lat && location.lon) {
      history(`/weatherLocation/${location.lat}/${location.lon}`);
    } else {
      // Fallback to history back if location coordinates are not available
      history(-1);
    }
  }

  function handleSubmit(e, index) {
    e.preventDefault();
    history(`/Single3HourForecast/${index}/${location.lat}/${location.lon}`);
  }

  useEffect(() => {
    document.title = 'Worther - 3 Hour Weather - ' + (location.name || '');
  }, [location.name]);

  useEffect(() => {
    if (!loading) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}&units=metric`
        );

        // Process all weather data at once instead of updating state in a loop
        const weatherData = response.data.list.map(weatherAPI => ({
          humidity: weatherAPI.main.humidity,
          temperature: weatherAPI.main.temp,
          tempFeel: weatherAPI.main.feels_like,
          pressure: weatherAPI.main.pressure,
          mainWeather: weatherAPI.weather[0].main,
          description: weatherAPI.weather[0].description,
          weatherId: weatherAPI.weather[0].id,
          windSpeed: weatherAPI.wind.speed,
          windDegrees: weatherAPI.wind.deg,
          precipitation: weatherAPI.pop * 100,
          visibility: weatherAPI.visibility,
          dayUNIX: weatherAPI.dt * 1000,
          timeNormalHour: String(new Date(weatherAPI.dt * 1000).getHours()).padStart(2, '0'),
          timeNormalMinutes: String(new Date(weatherAPI.dt * 1000).getMinutes()).padStart(2, '0'),
        }));

        // Set all weather data in a single update
        setWeather(weatherData);

        setLocation({
          name: response.data.city.name,
          country: response.data.city.country,
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon,
          timeZone: response.data.city.timezone,
        });

        setTimes({
          sunrise: response.data.city.sunrise,
          sunset: response.data.city.sunset,
          timeZone: response.data.city.timezone,
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
      const day = new Date(
        item.dayUNIX + location.timeZone * 1000 + new Date().getTimezoneOffset() * 60 * 1000
      ).toDateString();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({ ...item, index });
    });

    return grouped;
  }, [weather, location.timeZone]); // Only recalculate when these dependencies change

  const localSunriseSunsetTimes =
    times?.sunrise && times?.sunset && times?.timeZone !== undefined
      ? SunriseSunsetTimes(times)
      : null;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <div className="flex grow flex-col px-4 text-center text-white md:px-6 lg:px-8">
        <div className="relative my-8 flex flex-col sm:flex-row sm:items-center sm:justify-center">
          <section className="mb-6">
            <button
              className="group mx-4 mb-4 flex cursor-pointer items-center self-start font-medium text-blue-400 transition-colors duration-300 hover:text-blue-300 sm:absolute sm:left-4 sm:mx-0 sm:mb-0"
              onClick={handleNavigateBack}
              aria-label="Go back to the weather page"
            >
              <FaArrowLeft className="mr-2 h-5 w-5 translate-x-1 transform transition-transform duration-300 group-hover:translate-x-0" />
              Back to Weather
            </button>
          </section>
          <p className="animate-text bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent lg:text-4xl">
            {location.name ? `3 Hour Forecast - ${location.name}` : 'Loading...'}
          </p>
        </div>
        {weather.length > 0 ? (
          Object.entries(groupedWeatherByDay).map(([day, dayWeather]) => (
            <div key={day} className="mb-6">
              <h2 className="rounded-t-lg border-b border-blue-900 bg-gradient-to-r from-gray-900 to-slate-900 py-3 text-3xl font-bold text-blue-400">
                {day}
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-2 md:gap-3">
                {dayWeather.map(weather => {
                  const hourConversion = Math.round(
                    (weather.timeNormalHour * 3600 +
                      new Date().getTimezoneOffset() * 60 +
                      location.timeZone) /
                      3600
                  );
                  return (
                    <button
                      aria-label={`Weather forecast for ${day} at ${hourConversion > 23 ? String(hourConversion - 24).padStart(2, '0') : hourConversion < 0 ? hourConversion + 24 : String(hourConversion).padStart(2, '0')}:${weather.timeNormalMinutes}, ${weather.description}`}
                      key={weather.index}
                      onClick={e => handleSubmit(e, weather.index)}
                      className="flex cursor-pointer flex-col rounded-lg border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-3 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-700 hover:shadow-cyan-900/30 md:p-4 lg:grid lg:grid-cols-7 lg:items-center lg:gap-2"
                    >
                      <div className="mx-auto lg:justify-self-center">
                        <div className="flex h-[85px] items-center justify-center">
                          <WeatherIcons
                            weatherId={weather.weatherId}
                            windSpeed={weather.windSpeed}
                            timeZone={times.timeZone}
                            sunriseHour={localSunriseSunsetTimes?.sunriseHour}
                            sunsetHour={localSunriseSunsetTimes?.sunsetHour}
                            hourConversion={hourConversion}
                            page={isDesktopView ? 'multiple' : 'multiple-mobile'}
                          />
                        </div>
                      </div>
                      <div className="mx-auto text-xl font-bold text-cyan-300 lg:justify-self-center">
                        {hourConversion > 23
                          ? String(hourConversion - 24).padStart(2, '0')
                          : hourConversion < 0
                            ? hourConversion + 24
                            : String(hourConversion).padStart(2, '0')}
                        :{weather.timeNormalMinutes}
                        <div className="mt-1 text-base">
                          (<TimeZoneShow timeZone={location.timeZone} />)
                        </div>
                      </div>
                      <div className="mx-auto mt-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent lg:mt-0 lg:justify-self-center">
                        {weather.description.toUpperCase()}
                      </div>
                      <div className="mx-auto mt-3 text-xl lg:mt-0 lg:justify-self-center">
                        Temp:{' '}
                        <span className="font-semibold text-yellow-400">
                          {Math.round(weather.temperature)}°C
                        </span>
                      </div>
                      <div className="mx-auto mt-3 text-xl lg:mt-0 lg:justify-self-center">
                        Wind Speed:{' '}
                        <span className="font-semibold text-green-400">
                          {weather.windSpeed} m/s
                        </span>{' '}
                        ({<WindForce windSpeed={weather.windSpeed} />})
                        <div className="flex items-center lg:mt-1 lg:pl-2">
                          <div className="wind-arrow-container mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/70">
                            <WindArrow degrees={weather.windDegrees} />
                          </div>
                          <span>
                            Direction: {<WindDirection windDegrees={weather.windDegrees} />} @{' '}
                            {weather.windDegrees}°
                          </span>
                        </div>
                      </div>
                      <div className="mx-auto mt-3 text-xl lg:mt-0 lg:justify-self-center">
                        Precipitation:{' '}
                        <span className="font-semibold text-blue-400">
                          {Math.round(weather.precipitation)}%
                        </span>
                      </div>
                      <div className="mx-auto mt-3 mb-3 text-xl lg:mt-0 lg:mb-0 lg:justify-self-center">
                        Visibility:{' '}
                        <span className="font-semibold">
                          {weather.visibility >= 1000
                            ? weather.visibility / 1000 + 'km'
                            : weather.visibility + 'm'}
                        </span>{' '}
                        ({<VisibilityDesc visibility={weather.visibility} />})
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-grow items-center justify-center">
            <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-lg">
              <div className="flex animate-pulse flex-col items-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-blue-700"></div>
                <div className="mb-3 h-6 w-48 rounded bg-gray-700"></div>
                <div className="h-4 w-32 rounded bg-gray-700"></div>
                <p className="mt-4 text-gray-400">Loading forecast data...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
