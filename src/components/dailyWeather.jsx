import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { BsFillSunriseFill, BsFillSunsetFill } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoWarningOutline } from 'react-icons/io5';
import { useParams, useNavigate } from 'react-router-dom';

import {
  TimeZoneShow,
  SunriseSunsetTimes,
  VisibilityDesc,
  WindDirection,
  WindForce,
} from '@components/weather/helpers/weatherHelpers';
import { WeatherIcons, WindArrow } from '@components/weather/WeatherIcons';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

// Weather phenomena types for consistent tracking
const WEATHER_PHENOMENA = {
  THUNDER: 'thunder',
  RAIN: 'rain',
  DRIZZLE: 'drizzle',
  SNOW: 'snow',
  FOG: 'atmosphere',
  CLEAR: 'clear',
  CLOUDS: 'clouds',
  PARTLY_CLOUDY: 'partly-cloudy', // Added for null condition handling
};

// Unified function to classify weather conditions based on condition ID
const classifyWeatherCondition = conditionId => {
  if (conditionId == null) return WEATHER_PHENOMENA.PARTLY_CLOUDY; // Handle null/undefined
  if (conditionId >= 200 && conditionId < 300) return WEATHER_PHENOMENA.THUNDER;
  if (conditionId >= 300 && conditionId < 400) return WEATHER_PHENOMENA.DRIZZLE;
  if (conditionId >= 500 && conditionId < 600) return WEATHER_PHENOMENA.RAIN;
  if (conditionId >= 600 && conditionId < 700) return WEATHER_PHENOMENA.SNOW;
  if (conditionId >= 700 && conditionId < 800) return WEATHER_PHENOMENA.FOG;
  if (conditionId === 800) return WEATHER_PHENOMENA.CLEAR;
  return WEATHER_PHENOMENA.CLOUDS; // Default for 801-899 (clouds)
};

export function DailyWeatherData() {
  const { lat, lon } = useParams();

  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState([]);
  const [times, setTimes] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Worther - Daily Weather - ' + (location.name || '');
  }, [location.name]);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}&units=metric`
      )
      .then(response => {
        const locationObj = {
          name: response.data.city.name,
          country: response.data.city.country,
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon,
          timeZone: response.data.city.timezone,
        };
        setLocation(locationObj);

        const dailyData = {};

        for (const weatherAPI of response.data.list) {
          const date = new Date(weatherAPI.dt * 1000).toDateString();
          if (!dailyData[date]) {
            dailyData[date] = {
              maxPrecipitation: 0,
              humidity: 0,
              visibility: 0,
              windSpeed: 0,
              windSin: 0,
              windCos: 0,
              tempMin: weatherAPI.main.temp,
              tempMax: weatherAPI.main.temp,
              count: 0,
              weatherConditions: {}, // Track all weather conditions with counts
              phenomena: {}, // Single object to track all weather phenomena
              weather:
                weatherAPI.weather && weatherAPI.weather.length > 0
                  ? weatherAPI.weather[0]
                  : { id: null, main: 'Unknown', description: 'No weather data available' },
            };
          }

          // Track all weather conditions that occur during the day
          // Validate weatherAPI.weather is a valid array before iterating
          if (
            weatherAPI.weather &&
            Array.isArray(weatherAPI.weather) &&
            weatherAPI.weather.length > 0
          ) {
            for (const condition of weatherAPI.weather) {
              if (!dailyData[date].weatherConditions[condition.id]) {
                dailyData[date].weatherConditions[condition.id] = {
                  count: 0,
                  description: condition.description,
                  main: condition.main,
                  icon: condition.icon,
                };
              }
              dailyData[date].weatherConditions[condition.id].count += 1;

              // Track weather phenomena using the single object
              const phenomenonType = classifyWeatherCondition(condition.id);
              if (!dailyData[date].phenomena[phenomenonType]) {
                dailyData[date].phenomena[phenomenonType] = {
                  count: 0,
                  description: condition.description,
                };
              }
              dailyData[date].phenomena[phenomenonType].count += 1;
            }
          } else {
            // Handle case where weather data is missing or invalid
            const defaultPhenomenonType = WEATHER_PHENOMENA.PARTLY_CLOUDY;
            if (!dailyData[date].phenomena[defaultPhenomenonType]) {
              dailyData[date].phenomena[defaultPhenomenonType] = {
                count: 0,
                description: 'Unknown weather conditions',
              };
            }
            dailyData[date].phenomena[defaultPhenomenonType].count += 1;
          }

          // Update max precipitation probability instead of multiplying
          dailyData[date].maxPrecipitation = Math.max(
            dailyData[date].maxPrecipitation,
            weatherAPI.pop
          );
          dailyData[date].humidity += weatherAPI.main.humidity;
          dailyData[date].visibility += weatherAPI.visibility;
          dailyData[date].windSpeed += weatherAPI.wind.speed;
          const windRad = (weatherAPI.wind.deg * Math.PI) / 180;
          dailyData[date].windCos += Math.cos(windRad);
          dailyData[date].windSin += Math.sin(windRad);
          dailyData[date].tempMin = Math.min(dailyData[date].tempMin, weatherAPI.main.temp_min);
          dailyData[date].tempMax = Math.max(dailyData[date].tempMax, weatherAPI.main.temp_max);
          dailyData[date].count += 1;
        }

        const weatherArray = Object.keys(dailyData).map(date => {
          const data = dailyData[date];

          // Find the most prominent weather condition based on count
          let mostProminentConditionId = null;
          let highestCount = 0;

          Object.entries(data.weatherConditions).forEach(([conditionId, conditionData]) => {
            if (conditionData.count > highestCount) {
              highestCount = conditionData.count;
              mostProminentConditionId = Number(conditionId);
            }
          });

          // Use the most prominent condition as the main weather condition
          const prominentCondition = mostProminentConditionId
            ? data.weatherConditions[mostProminentConditionId]
            : { main: data.weather.main, description: data.weather.description };

          // Determine the type of the most prominent condition
          const prominentConditionType =
            mostProminentConditionId !== null
              ? classifyWeatherCondition(mostProminentConditionId)
              : WEATHER_PHENOMENA.PARTLY_CLOUDY;

          // Create warning messages based on phenomena
          const warnings = [];

          // Check for significant weather phenomena that aren't the dominant condition type
          if (
            data.phenomena[WEATHER_PHENOMENA.THUNDER]?.count > 0 &&
            prominentConditionType !== WEATHER_PHENOMENA.THUNDER
          ) {
            warnings.push('Thunderstorms possible');
          }

          if (
            (data.phenomena[WEATHER_PHENOMENA.RAIN]?.count > 0 ||
              data.phenomena[WEATHER_PHENOMENA.DRIZZLE]?.count > 0) &&
            prominentConditionType !== WEATHER_PHENOMENA.RAIN &&
            prominentConditionType !== WEATHER_PHENOMENA.DRIZZLE
          ) {
            warnings.push('Rain expected');
          }

          if (
            data.phenomena[WEATHER_PHENOMENA.SNOW]?.count > 0 &&
            prominentConditionType !== WEATHER_PHENOMENA.SNOW
          ) {
            warnings.push('Snow expected');
          }

          if (
            data.phenomena[WEATHER_PHENOMENA.FOG]?.count > 0 &&
            prominentConditionType !== WEATHER_PHENOMENA.FOG
          ) {
            warnings.push('Reduced visibility possible');
          }

          return {
            date,
            precipitation: Number((data.maxPrecipitation * 100).toFixed(2)), // Use maxPrecipitation directly
            humidity: Number((data.humidity / data.count).toFixed(2)),
            visibility: Number((data.visibility / data.count).toFixed(2)),
            windSpeed: Number((data.windSpeed / data.count).toFixed(2)),
            windDegrees: ((Math.atan2(data.windSin, data.windCos) * 180) / Math.PI + 360) % 360,
            tempMin: data.tempMin,
            tempMax: data.tempMax,
            weather: {
              ...data.weather,
              main: prominentCondition.main,
              description: prominentCondition.description,
            },
            warnings: warnings,
            hasWarnings: warnings.length > 0,
          };
        });

        setWeather(weatherArray);

        const timesObj = {
          sunrise: response.data.city.sunrise,
          sunset: response.data.city.sunset,
          timeZone: response.data.city.timezone,
        };
        setTimes(timesObj);
      })
      .catch(error => {
        if (import.meta.env.MODE !== 'production') {
          console.error('Weather data fetch error:', error);
        }
        if (error.response?.status === 429) {
          // Rate limit exceeded
          setError('Too many requests. Rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 401) {
          // API key issues
          setError(
            <>
              Authentication error. Please{' '}
              <a
                href="https://github.com/vikingnope/worther/issues/new?template=bug_report.md"
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                open an issue on GitHub
              </a>{' '}
              stating this error.
            </>
          );
        } else {
          setError('Failed to fetch weather data. Please try again.');
        }
      });
  }, [lat, lon]);

  const localSunriseSunsetTimes =
    times?.sunrise && times?.sunset && times?.timeZone !== undefined
      ? SunriseSunsetTimes(times)
      : null;

  const localDayConversions = useMemo(() => {
    if (!weather.length || !location.timeZone) return {};

    return weather.reduce((acc, item) => {
      acc[item.date] = new Date(
        new Date(item.date).getTime() +
          location.timeZone * 1000 +
          new Date().getTimezoneOffset() * 60 * 1000
      ).toDateString();
      return acc;
    }, {});
  }, [weather, location.timeZone]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <div className="flex grow flex-col text-center text-white">
        <div className="relative my-8 flex flex-col sm:flex-row sm:items-center sm:justify-center">
          <section className="mb-6">
            <button
              className="group mx-4 mb-4 flex cursor-pointer items-center self-start font-medium text-blue-400 transition-colors duration-300 hover:text-blue-300 md:absolute md:left-4 md:mx-0 md:mb-0 lg:left-12"
              onClick={() => navigate(-1)}
              aria-label="Go back to the last page"
            >
              <FaArrowLeft className="mr-2 h-5 w-5 translate-x-1 transform transition-transform duration-300 group-hover:translate-x-0" />
              Back to Last Page
            </button>
          </section>
          <p className="text-4xl font-bold underline">
            Daily Forecast Data {location.name?.trim() ? `- ${location.name}` : ''}{' '}
          </p>
        </div>
        <div className="w-full max-w-full gap-4 px-4 pb-6 xl:grid xl:grid-cols-1 xl:px-8">
          {weather.length > 0 ? (
            <>
              <div className="hidden sm:mb-4 sm:flex sm:items-center sm:justify-center xl:hidden">
                <div
                  className="flex items-center rounded-full bg-blue-600/30 px-3 py-1 text-xs text-white"
                  aria-label="Scroll to view more days"
                >
                  <span className="animate-pulse">⟵</span>
                  <span className="mx-2">Scroll to view more days</span>
                  <span className="animate-pulse">⟶</span>
                </div>
              </div>
              <div className="hide-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4 xl:grid xl:auto-cols-fr xl:grid-flow-col">
                {weather.map((weather, index) => {
                  const dayConversion = localDayConversions[weather.date];

                  return (
                    <div
                      key={index}
                      className="mx-2 flex h-full min-w-[85%] snap-center flex-col justify-between overflow-hidden border-y border-blue-900/30 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 px-4 py-4 break-words text-white backdrop-blur-sm transition-all duration-300 first:ml-4 last:mr-4 sm:min-w-[60%] md:min-w-[45%] xl:mx-0 xl:min-h-[900px] xl:w-full xl:min-w-0 xl:rounded-xl xl:border xl:border-blue-900/50 xl:px-6 xl:py-6 xl:hover:bg-gradient-to-r xl:hover:from-slate-800 xl:hover:via-blue-950 xl:hover:to-slate-800 xl:hover:shadow-xl xl:hover:shadow-blue-900/20"
                      role="article"
                      aria-label={`Weather forecast for ${dayConversion}`}
                    >
                      {/* Day header section */}
                      <div className="mx-auto mt-1 mb-3 shrink-0 text-center xl:mt-2 xl:mb-6">
                        <p className="animate-text mb-1 block bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent xl:mb-2 xl:text-3xl">
                          {dayConversion}
                        </p>
                        <span className="mb-4 inline-block h-1 w-24 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-400 xl:mb-8"></span>
                      </div>

                      {/* Weather Icon - Moved to the middle */}
                      <div className="relative mb-6 flex justify-center xl:mb-8">
                        <div className="absolute inset-0 rounded-full bg-emerald-600/10 blur-xl"></div>
                        <div className="relative transform transition-transform duration-300 hover:scale-110">
                          <div className="flex h-[120px] items-center justify-center">
                            <WeatherIcons
                              weatherId={weather.weather.id}
                              windSpeed={weather.windSpeed}
                              timeZone={times.timeZone}
                              sunriseHour={localSunriseSunsetTimes?.sunriseHour}
                              sunsetHour={localSunriseSunsetTimes?.sunsetHour}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Weather warnings section (if present) */}
                      {weather.hasWarnings && (
                        <div className="mb-4 xl:mb-6">
                          <div className="rounded-lg border border-amber-800/50 bg-amber-900/40 p-3 shadow-inner backdrop-blur-sm transition-all duration-300 xl:p-4">
                            <div className="flex items-center justify-center">
                              <IoWarningOutline className="mr-1 text-2xl text-amber-400" />
                              <p className="text-md text-amber-200 xl:text-lg">
                                {weather.warnings.join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Temperature section with highlight */}
                      <div className="mb-4 rounded-lg border border-gray-800/50 bg-black/30 p-3 shadow-inner backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:mb-8 xl:p-6">
                        <p className="mx-auto mb-1 text-center text-lg xl:mb-2 xl:text-xl">
                          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-2xl font-semibold text-transparent xl:text-3xl">
                            {Math.round(weather.tempMin)}°C - {Math.round(weather.tempMax)}°C
                          </span>
                        </p>
                        <p className="text-center text-xs text-gray-400 xl:text-sm">
                          Temperature Range
                        </p>
                      </div>

                      {/* Wind data section */}
                      <div className="mb-4 flex flex-col border-b border-gray-800/30 pb-3 xl:mb-8 xl:pb-6">
                        <h3 className="mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-center text-base font-semibold text-transparent xl:mb-4 xl:text-lg">
                          Wind Conditions
                        </h3>
                        <div className="grid grid-cols-2 gap-2 xl:gap-3">
                          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                            <p className="mb-0 text-base xl:mb-1 xl:text-lg">
                              {weather.windSpeed.toFixed(2)} m/s
                            </p>
                            <p className="text-xs text-yellow-400 xl:text-sm">
                              ({<WindForce windSpeed={weather.windSpeed} />})
                            </p>
                          </div>
                          <div className="relative rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                            <div className="mb-1 flex items-center justify-center">
                              <div className="wind-arrow-container mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/70">
                                <WindArrow degrees={weather.windDegrees} />
                              </div>
                            </div>
                            <p className="mb-0 flex items-center justify-center text-base xl:mb-1 xl:text-lg">
                              {<WindDirection windDegrees={weather.windDegrees} />}{' '}
                              <span className="ml-1 text-xs text-yellow-400 xl:text-sm">
                                @ {Math.round(weather.windDegrees)}°
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Other weather data section */}
                      <div className="mb-4 grid grid-cols-2 gap-2 xl:mb-8 xl:gap-4">
                        <div className="rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                          <p className="mb-0 text-base xl:mb-1 xl:text-lg">
                            {Math.round(weather.precipitation)}%
                          </p>
                          <p className="text-xs text-gray-400 xl:text-sm">Precipitation</p>
                        </div>
                        <div className="rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                          <p className="mb-0 text-base xl:mb-1 xl:text-lg">
                            {Math.round(weather.humidity)}%
                          </p>
                          <p className="text-xs text-gray-400 xl:text-sm">Humidity</p>
                        </div>
                        <div className="col-span-2 rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                          <p className="mb-0 text-base xl:mb-1 xl:text-lg">
                            {weather.visibility >= 1000
                              ? (weather.visibility / 1000).toFixed(2) + ' km'
                              : weather.visibility + ' m'}
                          </p>
                          <p className="text-xs text-blue-400 xl:text-sm">
                            ({<VisibilityDesc visibility={weather.visibility} />})
                          </p>
                        </div>
                      </div>

                      {/* Sunrise/Sunset section */}
                      <div className="mt-auto flex flex-col border-t border-gray-800/30 pt-3 xl:pt-6">
                        <h3 className="mb-2 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-center text-base font-semibold text-transparent xl:mb-4 xl:text-lg">
                          Day & Night
                        </h3>
                        <div className="grid grid-cols-2 gap-2 xl:gap-4">
                          <div className="rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                            <BsFillSunriseFill
                              size={24}
                              className="mb-1 inline text-orange-300 xl:mb-2"
                            />
                            <p className="mb-0 text-xs text-gray-300 xl:mb-1 xl:text-sm">Sunrise</p>
                            <p className="text-sm font-medium xl:text-base">
                              {localSunriseSunsetTimes
                                ? `${
                                    localSunriseSunsetTimes.sunriseHour > 23
                                      ? String(localSunriseSunsetTimes.sunriseHour - 24).padStart(
                                          2,
                                          '0'
                                        )
                                      : String(localSunriseSunsetTimes.sunriseHour).padStart(2, '0')
                                  }:${String(localSunriseSunsetTimes.sunriseMinute).padStart(2, '0')}`
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded-lg border border-gray-800/50 bg-black/30 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700/50 xl:p-4">
                            <BsFillSunsetFill
                              size={24}
                              className="mb-1 inline text-orange-400 xl:mb-2"
                            />
                            <p className="mb-0 text-xs text-gray-300 xl:mb-1 xl:text-sm">Sunset</p>
                            <p className="text-sm font-medium xl:text-base">
                              {localSunriseSunsetTimes
                                ? `${
                                    localSunriseSunsetTimes.sunsetHour < 0
                                      ? String(localSunriseSunsetTimes.sunsetHour + 24).padStart(
                                          2,
                                          '0'
                                        )
                                      : String(localSunriseSunsetTimes.sunsetHour).padStart(2, '0')
                                  }:${String(localSunriseSunsetTimes.sunsetMinute).padStart(2, '0')}`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {times.timeZone !== undefined && (
                          <p className="mt-2 text-center text-xs text-gray-400 xl:mt-3">
                            Time Zone: <TimeZoneShow timeZone={times.timeZone} />
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {error ? (
                <p className="mx-auto text-xl font-bold text-white" role="alert" aria-live="polite">
                  {error}
                </p>
              ) : (
                <div className="flex flex-grow items-center justify-center">
                  <div className="w-full max-w-md rounded-xl border border-blue-900/30 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-lg backdrop-blur-sm">
                    <div className="flex animate-pulse flex-col items-center">
                      <div className="mb-5 flex h-16 w-16 animate-spin items-center justify-center rounded-full bg-blue-700/70">
                        <div className="h-12 w-12 rounded-full bg-blue-900/70"></div>
                      </div>
                      <div className="mb-4 h-7 w-64 rounded-md bg-gradient-to-r from-gray-800 to-gray-700"></div>
                      <div className="h-5 w-48 rounded-md bg-gradient-to-r from-gray-800 to-gray-700"></div>
                      <p className="mt-5 font-medium text-gray-400">Loading forecast data...</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
