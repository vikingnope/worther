import axios from 'axios';
import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  BsFillSunriseFill,
  BsFillSunsetFill,
  BsFillCloudSlashFill,
  BsCloudFog,
  BsFillCloudRainFill,
  BsFillCloudDrizzleFill,
} from 'react-icons/bs';
import { FaTemperatureHigh, FaArrowLeft } from 'react-icons/fa';
import { GiWindsock } from 'react-icons/gi';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { useNavigate, Link } from 'react-router-dom';

import {
  TimeZoneShow,
  SunriseSunsetTimes,
  VisibilityDesc,
  WindDirection,
  WindForce,
  formatTimeDisplay,
} from '@components/weather/helpers/weatherHelpers';
import { WeatherIcons, WindArrow } from '@components/weather/WeatherIcons';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

// Note: Weather-related files have been organized into a better structure:
// - @config/weatherIconConfig.js: Weather icon configuration and mapping
// - @utils/weatherHelpers.js: Pure utility functions (timezone, visibility, wind, etc.)
// - @components/weather/WeatherIcons.jsx: Weather icon components
// - @components/weather/WeatherDisplay.jsx: Main weather display components (this file)

export function ShowWeather(props) {
  // Keep these useMemo - they're doing calculations/transformations
  const timeUpdated = useMemo(
    () => ({
      timeUpdatedHour: String(new Date(props.timeUpdatedUNIX * 1000).getHours()).padStart(2, '0'),
      timeUpdatedMinute: String(new Date(props.timeUpdatedUNIX * 1000).getMinutes()).padStart(
        2,
        '0'
      ),
    }),
    [props.timeUpdatedUNIX]
  );

  const timeUpdatedHourConversion = useMemo(() => {
    const convertedHour = Math.round(
      (timeUpdated.timeUpdatedHour * 3600 + new Date().getTimezoneOffset() * 60 + props.timeZone) /
        3600
    );
    // Handle hour wrapping for 24-hour format
    if (convertedHour > 23) return convertedHour - 24;
    if (convertedHour < 0) return convertedHour + 24;
    return convertedHour;
  }, [timeUpdated.timeUpdatedHour, props.timeZone]);

  const currentHourConversion = useMemo(
    () =>
      props.choice !== 'normal'
        ? Math.round(
            (props.currentTime.hour * 3600 + new Date().getTimezoneOffset() * 60 + props.timeZone) /
              3600
          )
        : null,
    [props.choice, props.currentTime?.hour, props.timeZone]
  );

  const history = useNavigate();

  function handleSubmitNormal(e) {
    e.preventDefault();
    history(-1);
  }

  function handleSubmitAdvanced(e) {
    e.preventDefault();
    history('/3HourForecast/' + props.lat + '/' + props.lon);
  }

  function WeatherDisplay() {
    return (
      <div className="mx-auto flex w-full max-w-4xl grow flex-col justify-center px-4 py-6">
        {/* Back button - moved to top left */}
        <section className="-mb-2">
          <button
            className="group mx-4 mb-3 flex cursor-pointer items-center self-start font-medium text-blue-400 transition-colors duration-300 hover:text-cyan-300 sm:absolute sm:mx-0 sm:mb-0"
            onClick={props.choice === 'normal' ? handleSubmitNormal : handleSubmitAdvanced}
          >
            <FaArrowLeft className="mr-2 h-5 w-5 translate-x-1 transform transition-transform duration-300 group-hover:translate-x-0" />
            Back to Last Page
          </button>
        </section>

        {/* Location and time information */}
        <section className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent">
            {props.name}, {props.country}
          </h1>

          {props.dayConversion && (
            <div className="mt-3">
              <p className="text-2xl font-medium text-white/90">{props.dayConversion}</p>
              <p className="mt-1 text-xl text-white/80">
                {(props.hourConversion > 23
                  ? props.hourConversion - 24
                  : props.hourConversion < 0
                    ? props.hourConversion + 24
                    : props.hourConversion
                )
                  .toString()
                  .padStart(2, '0')}
                :{props.timeNormalMinutes}
                <span className="ml-2 text-gray-400">
                  (<TimeZoneShow timeZone={props.timeZone} />)
                </span>
              </p>
            </div>
          )}
        </section>

        {/* Main weather display card */}
        <section className="mb-8 rounded-xl border border-blue-900/30 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          <div className="mb-4 flex flex-col items-center md:flex-row">
            {/* Weather icon */}
            <div className="relative mb-4 md:mr-8 md:mb-0">
              <div className="absolute inset-0 rounded-full bg-blue-600/10 blur-2xl"></div>
              <div className="relative">
                <div className="flex h-[200px] items-center justify-center">
                  <WeatherIcons
                    weatherId={props.weatherId}
                    windSpeed={props.windSpeed}
                    timeZone={props.timeZone}
                    sunriseHour={props.localSunriseSunsetTimes?.sunriseHour}
                    sunsetHour={props.localSunriseSunsetTimes?.sunsetHour}
                    hourConversion={props.hourConversion}
                    page="single"
                  />
                </div>
              </div>
            </div>

            {/* Temperature information */}
            <div className="text-center md:text-left">
              <p className="mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
                {props.description.toUpperCase()}
              </p>
              <div className="flex items-center justify-center md:justify-start">
                <FaTemperatureHigh size={28} className="mr-3 text-amber-400" />
                <span className="text-6xl font-bold text-white">
                  {Math.round(props.temperature)}°C
                </span>
              </div>
              <p className="mt-2 text-xl text-white/90">
                Feels like: {Math.round(props.tempFeel)}°C
              </p>
              <div className="mt-2 flex justify-center gap-5 md:justify-start">
                <span className="flex items-center text-blue-300">
                  <IoIosArrowDown className="mr-1 h-5 w-5 text-blue-300" />
                  Min: {Math.round(props.tempMin)}°C
                </span>
                <span className="flex items-center text-red-300">
                  <IoIosArrowUp className="mr-1 h-5 w-5 text-red-300" />
                  Max: {Math.round(props.tempMax)}°C
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed weather information section */}
        <section className="mb-8 rounded-xl border border-blue-900/30 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <h2 className="mb-5 border-b border-blue-900/50 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text pb-2 text-xl font-bold text-transparent">
            Weather Details
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                <WiHumidity size={38} className="mr-3 text-blue-400" />
                <div>
                  <p className="font-medium text-blue-300">Humidity</p>
                  <p className="text-lg font-bold">{props.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                <WiBarometer size={38} className="mr-3 text-purple-400" />
                <div>
                  <p className="font-medium text-purple-300">Pressure</p>
                  <p className="text-lg font-bold">{props.pressure} hPa</p>
                </div>
              </div>

              <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                <BsCloudFog size={32} className="mr-3 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-300">Visibility</p>
                  <p className="text-lg font-bold">
                    {props.visibility >= 1000
                      ? `${props.visibility / 1000}km`
                      : `${props.visibility}m`}
                    <span className="ml-1 text-sm font-normal text-gray-400">
                      (<VisibilityDesc visibility={props.visibility} />)
                    </span>
                  </p>
                </div>
              </div>

              {props.rain !== undefined && (
                <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                  <BsFillCloudRainFill size={32} className="mr-3 text-blue-300" />
                  <div>
                    <p className="font-medium text-blue-200">Rain (last hour)</p>
                    <p className="text-lg font-bold">{props.rain} mm</p>
                  </div>
                </div>
              )}

              {props.precipitation !== undefined && (
                <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                  <BsFillCloudDrizzleFill size={32} className="mr-3 text-blue-200" />
                  <div>
                    <p className="font-medium text-blue-100">Precipitation</p>
                    <p className="text-lg font-bold">{props.precipitation}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                <WiStrongWind size={38} className="mr-3 text-teal-400" />
                <div>
                  <p className="font-medium text-teal-300">Wind</p>
                  <p className="text-lg font-bold">
                    {props.windSpeed} m/s{' '}
                    <span className="text-sm font-normal text-gray-400">
                      (<WindForce windSpeed={props.windSpeed} />)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                <GiWindsock size={32} className="mr-3 text-cyan-400" />
                <div className="flex-1">
                  <p className="font-medium text-cyan-300">Wind Direction</p>
                  <div className="flex items-center">
                    <div className="wind-arrow-container mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/70">
                      <WindArrow degrees={props.windDegrees} />
                    </div>
                    <p className="text-lg font-bold">
                      <WindDirection windDegrees={props.windDegrees} /> @ {props.windDegrees}°
                    </p>
                  </div>
                </div>
              </div>

              {props.localSunriseSunsetTimes && (
                <>
                  <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                    <BsFillSunriseFill size={32} className="mr-3 text-yellow-400" />
                    <div>
                      <p className="font-medium text-yellow-300">Sunrise</p>
                      <p className="text-lg font-bold">
                        {formatTimeDisplay(
                          props.localSunriseSunsetTimes.sunriseHour,
                          props.localSunriseSunsetTimes.sunriseMinute
                        )}
                        <span className="ml-1 text-sm font-normal text-gray-400">
                          (<TimeZoneShow timeZone={props.timeZone} />)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center rounded-lg border border-gray-800/50 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50">
                    <BsFillSunsetFill size={32} className="mr-3 text-orange-400" />
                    <div>
                      <p className="font-medium text-orange-300">Sunset</p>
                      <p className="text-lg font-bold">
                        {formatTimeDisplay(
                          props.localSunriseSunsetTimes.sunsetHour,
                          props.localSunriseSunsetTimes.sunsetMinute
                        )}
                        <span className="ml-1 text-sm font-normal text-gray-400">
                          (<TimeZoneShow timeZone={props.timeZone} />)
                        </span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Forecast buttons section */}
        {props.choice === 'normal' && (
          <section className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <form onSubmit={props.handleSubmit3Hour}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3 font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-500 hover:shadow-lg"
                >
                  3 Hour Forecast
                </button>
              </form>

              <form onSubmit={props.handleSubmitDaily}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-3 font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-600 hover:to-indigo-500 hover:shadow-lg"
                >
                  Daily Forecast
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Navigation and update info */}
        <section className="mt-auto text-center">
          <p className="text-sm text-gray-400">
            Last Updated:{' '}
            {props.choice === 'normal'
              ? `${timeUpdatedHourConversion.toString().padStart(2, '0')}:${timeUpdated.timeUpdatedMinute}`
              : `${currentHourConversion?.toString().padStart(2, '0')}:${props.currentTime.minute}`}{' '}
            (<TimeZoneShow timeZone={props.timeZone} />)
          </p>
        </section>
      </div>
    );
  }

  function ErrorDisplay({ message, countryName }) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-xl border border-blue-900/30 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          <div className="mb-8">
            <BsFillCloudSlashFill size={60} className="mx-auto mb-4 text-blue-400" />
            <p className="mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent">
              {message}
            </p>
            {countryName && (
              <p className="mt-2 text-xl text-gray-300">
                Country: <span className="font-medium">{countryName}</span>
              </p>
            )}
            <p className="mt-3 text-gray-400">Unable to retrieve weather data</p>
          </div>
          <Link
            className="inline-block cursor-pointer rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3 font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-500 hover:shadow-lg"
            to="/weather"
          >
            Return to Weather Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      {props.loaded ? (
        props.mainWeather && <WeatherDisplay />
      ) : props.blocked ? (
        <ErrorDisplay message="The API is currently blocked" />
      ) : props.connectionError ? (
        <ErrorDisplay message="Please check your internet connection" />
      ) : props.loading ? (
        <div className="flex flex-grow items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-blue-900/50 bg-gradient-to-br from-slate-900 to-gray-900 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-sm">
            <div className="flex animate-pulse flex-col items-center">
              <div className="mb-5 h-14 w-14 animate-spin rounded-full bg-blue-700/70"></div>
              <div className="mb-4 h-7 w-64 rounded-md bg-gradient-to-r from-gray-800 to-gray-700"></div>
              <div className="h-5 w-48 rounded-md bg-gradient-to-r from-gray-800 to-gray-700"></div>
              <p className="mt-5 font-medium text-gray-400">Loading weather data...</p>
            </div>
          </div>
        </div>
      ) : !props.mainWeather ? (
        props.isAdvancedSearch ? (
          <ErrorDisplay
            message={`The city you have entered ('${props.city}') has not been found`}
            countryName={props.countryName}
          />
        ) : (
          <ErrorDisplay
            message={`The city you have entered ('${props.city}') has not been found`}
          />
        )
      ) : (
        <ErrorDisplay message="An unknown error occurred" />
      )}
      <Footer />
    </div>
  );
}

export function WeatherPopupContent(props) {
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Function to fetch weather data for current location
  const fetchWeatherForCurrentLocation = useCallback(async () => {
    if (!props.userPos.latitude || !props.userPos.longitude) return;

    setIsLoadingWeather(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${props.userPos.latitude}&lon=${props.userPos.longitude}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`
      );
      setCurrentLocationWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [props.userPos]);

  // Fetch weather data when user position is available
  useEffect(() => {
    if (props.userPos.latitude && props.userPos.longitude) {
      fetchWeatherForCurrentLocation();
    }
  }, [props.userPos, fetchWeatherForCurrentLocation]);

  const localSunriseSunsetTimes = useMemo(() => {
    if (
      currentLocationWeather?.sys?.sunrise &&
      currentLocationWeather?.sys?.sunset &&
      currentLocationWeather?.timezone !== undefined
    ) {
      return SunriseSunsetTimes({
        sunrise: currentLocationWeather.sys.sunrise,
        sunset: currentLocationWeather.sys.sunset,
        timeZone: currentLocationWeather.timezone,
      });
    }
    return null;
  }, [currentLocationWeather]);

  // Determine styles based on map type for map page
  const popupStyles = (() => {
    if (props.page === 'map') {
      return props.theme === 'light'
        ? {
            background: '#ffffff',
            color: '#000000',
            buttonBg: '#e0e0e0',
            buttonHoverBg: '#c0c0c0',
            buttonText: '#000000',
            heading: '#1e40af', // Deep blue for headings in light mode
            description: '#6d28d9', // Purple for weather description in light mode
            labelColor: '#4b5563', // Gray-600 for labels in light mode
            valueColor: '#111827', // Gray-900 for values in light mode
            linkBg: '#2563eb', // Blue-600 for link in light mode
            linkHoverBg: '#1d4ed8', // Blue-700 for link hover in light mode
          }
        : {
            background: '#1a1a1a',
            color: '#ffffff',
            buttonBg: '#333333',
            buttonHoverBg: '#444444',
            buttonText: '#ffffff',
            heading: '#38bdf8', // Light blue for headings in dark mode
            description: '#fcd34d', // Yellow-300 for description in dark mode
            labelColor: '#9ca3af', // Gray-400 for labels in dark mode
            valueColor: '#ffffff', // White for values in dark mode
            linkBg: '#1d4ed8', // Blue-700 for link in dark mode
            linkHoverBg: '#2563eb', // Blue-600 for link hover in dark mode
          };
    }
    return {}; // Default styles for non-map pages
  })();

  if (isLoadingWeather) {
    return (
      <div
        className="p-3 text-center font-medium"
        style={
          props.page === 'map'
            ? { color: popupStyles.color, background: popupStyles.background }
            : {}
        }
      >
        Loading weather data...
      </div>
    );
  }

  if (!currentLocationWeather) {
    return (
      <div
        className="p-3"
        style={
          props.page === 'map'
            ? { color: popupStyles.color, background: popupStyles.background }
            : {}
        }
      >
        <p className="mb-2 text-base font-medium">Failed to load weather data</p>
        <button
          onClick={fetchWeatherForCurrentLocation}
          className="mt-2 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-blue-600"
          style={
            props.page === 'map'
              ? {
                  backgroundColor: popupStyles.buttonBg,
                  color: popupStyles.buttonText,
                }
              : { backgroundColor: '#3b82f6', color: 'white' }
          }
          onMouseOver={e => {
            if (props.page === 'map') {
              e.currentTarget.style.backgroundColor = popupStyles.buttonHoverBg;
            }
          }}
          onMouseOut={e => {
            if (props.page === 'map') {
              e.currentTarget.style.backgroundColor = popupStyles.buttonBg;
            }
          }}
          onFocus={e => {
            if (props.page === 'map') {
              e.currentTarget.style.backgroundColor = popupStyles.buttonHoverBg;
            }
          }}
          onBlur={e => {
            if (props.page === 'map') {
              e.currentTarget.style.backgroundColor = popupStyles.buttonBg;
            }
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-xs p-3"
      style={
        props.page === 'map' ? { color: popupStyles.color, background: popupStyles.background } : {}
      }
    >
      {/* Location name with enhanced font */}
      <h3
        className="mb-1.5 text-xl font-bold tracking-tight"
        style={props.page === 'map' ? { color: popupStyles.heading } : { color: 'text-cyan-300' }}
      >
        {currentLocationWeather.name}
      </h3>

      {/* Temperature and weather icon section */}
      <div className="mb-2 flex items-center">
        {currentLocationWeather.weather?.[0] && (
          <WeatherIcons
            weatherId={currentLocationWeather.weather[0].id}
            windSpeed={currentLocationWeather.wind?.speed}
            timeZone={currentLocationWeather.timezone}
            sunriseHour={localSunriseSunsetTimes?.sunriseHour}
            sunsetHour={localSunriseSunsetTimes?.sunsetHour}
            page="multiple"
            color={props.page === 'map' ? popupStyles.color : props.color || 'white'}
          />
        )}
        <span
          className="ml-2 text-3xl font-bold"
          style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
        >
          {Math.round(currentLocationWeather.main?.temp || 0)}°C
        </span>
      </div>

      {/* Weather description with improved styling */}
      <p
        className="mb-3 text-lg font-medium capitalize"
        style={
          props.page === 'map' ? { color: popupStyles.description } : { color: 'text-yellow-300' }
        }
      >
        {currentLocationWeather.weather?.[0]?.description || 'Unknown'}
      </p>

      {/* Weather details with better organization and font styling */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5">
        <div className="font-medium">
          <span
            className="mb-0.5 block text-sm"
            style={
              props.page === 'map' ? { color: popupStyles.labelColor } : { color: 'text-gray-300' }
            }
          >
            Humidity
          </span>
          <span
            className="text-base"
            style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
          >
            {currentLocationWeather.main?.humidity ?? '--'}%
          </span>
        </div>

        <div className="font-medium">
          <span
            className="mb-0.5 block text-sm"
            style={
              props.page === 'map' ? { color: popupStyles.labelColor } : { color: 'text-gray-300' }
            }
          >
            Wind
          </span>
          <span
            className="text-base"
            style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
          >
            {currentLocationWeather.wind?.speed
              ? `${Math.round(currentLocationWeather.wind.speed)} m/s`
              : '--'}
          </span>
        </div>

        <div className="font-medium">
          <span
            className="mb-0.5 block text-sm"
            style={
              props.page === 'map' ? { color: popupStyles.labelColor } : { color: 'text-gray-300' }
            }
          >
            Pressure
          </span>
          <span
            className="text-base"
            style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
          >
            {currentLocationWeather.main?.pressure
              ? `${currentLocationWeather.main.pressure} hPa`
              : '--'}
          </span>
        </div>

        <div className="font-medium">
          <span
            className="mb-0.5 block text-sm"
            style={
              props.page === 'map' ? { color: popupStyles.labelColor } : { color: 'text-gray-300' }
            }
          >
            Visibility
          </span>
          <span
            className="text-base"
            style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
          >
            {currentLocationWeather.visibility
              ? currentLocationWeather.visibility >= 1000
                ? `${currentLocationWeather.visibility / 1000} km`
                : `${currentLocationWeather.visibility} m`
              : '--'}
          </span>
        </div>

        <div className="font-medium">
          <span
            className="mb-0.5 block text-sm"
            style={
              props.page === 'map' ? { color: popupStyles.labelColor } : { color: 'text-gray-300' }
            }
          >
            Sunrise
          </span>
          <span
            className="text-base"
            style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
          >
            {localSunriseSunsetTimes
              ? formatTimeDisplay(
                  localSunriseSunsetTimes.sunriseHour,
                  localSunriseSunsetTimes.sunriseMinute
                )
              : '--:--'}
          </span>
        </div>

        <div className="font-medium">
          <span
            className="mb-0.5 block text-sm"
            style={
              props.page === 'map' ? { color: popupStyles.labelColor } : { color: 'text-gray-300' }
            }
          >
            Sunset
          </span>
          <span
            className="text-base"
            style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
          >
            {localSunriseSunsetTimes
              ? formatTimeDisplay(
                  localSunriseSunsetTimes.sunsetHour,
                  localSunriseSunsetTimes.sunsetMinute
                )
              : '--:--'}
          </span>
        </div>
      </div>

      {/* View detailed forecast link for map page */}
      {props.page === 'map' && (
        <Link
          className="mt-4 block rounded-md py-1.5 text-center text-sm font-bold transition-colors"
          style={{
            color: 'white',
            backgroundColor: popupStyles.linkBg,
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = popupStyles.linkHoverBg;
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = popupStyles.linkBg;
          }}
          onFocus={e => {
            e.currentTarget.style.backgroundColor = popupStyles.linkHoverBg;
          }}
          onBlur={e => {
            e.currentTarget.style.backgroundColor = popupStyles.linkBg;
          }}
          to={'/weatherLocation/' + props.userPos.latitude + '/' + props.userPos.longitude}
        >
          View detailed forecast
        </Link>
      )}
    </div>
  );
}
