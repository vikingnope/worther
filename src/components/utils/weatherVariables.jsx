import { useMemo, useCallback, useEffect, useState, memo } from 'react';
import { AiFillCloud } from 'react-icons/ai'; // Cloudy
import {
  BsFillSunFill,
  BsFillCloudRainHeavyFill,
  BsFillCloudDrizzleFill,
  BsFillCloudLightningRainFill,
  BsFillCloudSnowFill,
  BsCloudFog,
  BsFillCloudRainFill,
  BsFillCloudsFill,
  BsFillCloudSunFill,
  BsFillCloudHazeFill,
  BsFillSunriseFill,
  BsFillSunsetFill,
  BsFillCloudSlashFill,
} from 'react-icons/bs'; // Sunny, Rain, Drizzle, Thunder, Snow, Fog, etc.
import { FaTemperatureHigh, FaArrowLeft } from 'react-icons/fa'; // Temperature and back arrow icons
import { GiWindsock } from 'react-icons/gi'; // Wind sock icon
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { LiaLocationArrowSolid } from 'react-icons/lia'; // Wind direction arrow icon
import { MdModeNight } from 'react-icons/md'; // Night Clear
import { TbMist, TbWind } from 'react-icons/tb'; // Mist, Windy Clear
import {
  WiCloudyWindy,
  WiDayCloudyWindy,
  WiDayRainWind,
  WiDaySnowWind,
  WiNightFog,
  WiNightCloudyWindy,
  WiNightAltPartlyCloudy,
  WiNightAltCloudy,
  WiNightAltRainMix,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltStormShowers,
  WiNightAltSnow,
  WiNightAltRainWind,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSmoke,
  WiDust,
} from 'react-icons/wi'; // Weather icons for various conditions
import { useNavigate, Link } from 'react-router-dom';

import { Footer } from './footer';
import { Header } from './header';

// Weather icons mapping configuration
const weatherIconsMap = {
  night: {
    windy: {
      Clear: { icon: MdModeNight, sizeAdjust: 0 },
      'scattered clouds': { icon: WiNightCloudyWindy, sizeAdjust: 20 },
      'broken clouds': { icon: WiNightCloudyWindy, sizeAdjust: 20 },
      'few clouds': { icon: WiNightCloudyWindy, sizeAdjust: 17 },
      'overcast clouds': { icon: WiNightCloudyWindy, sizeAdjust: 17 },
      'light rain': { icon: WiNightAltRainWind, sizeAdjust: 0 },
      'heavy intensity rain': { icon: WiNightAltRainWind, sizeAdjust: 0 },
      'moderate rain': { icon: WiNightAltRainWind, sizeAdjust: 0 },
      'light intensity shower rain': { icon: WiNightAltRainWind, sizeAdjust: 0 },
      Drizzle: { icon: WiNightAltRainWind, sizeAdjust: 0 },
      'thunderstorm with light rain': { icon: WiNightAltStormShowers, sizeAdjust: 0 },
      Fog: { icon: WiNightFog, sizeAdjust: 0 },
      haze: { icon: WiNightFog, sizeAdjust: 0 },
      mist: { icon: WiNightFog, sizeAdjust: 0 },
      Snow: { icon: WiNightAltSnow, sizeAdjust: 0 },
      Smoke: { icon: WiSmoke, sizeAdjust: 0 },
      Dust: { icon: WiDust, sizeAdjust: 0 },
    },
    calm: {
      Clear: { icon: MdModeNight, sizeAdjust: 0 },
      'scattered clouds': { icon: WiNightAltPartlyCloudy, sizeAdjust: 30 },
      'broken clouds': { icon: WiNightAltPartlyCloudy, sizeAdjust: 30 },
      'few clouds': { icon: WiNightAltCloudy, sizeAdjust: 20 },
      'overcast clouds': { icon: WiNightAltCloudy, sizeAdjust: 20 },
      'light rain': { icon: WiNightAltRainMix, sizeAdjust: 0 },
      'heavy intensity rain': { icon: WiNightAltRain, sizeAdjust: 0 },
      'moderate rain': { icon: WiNightAltRain, sizeAdjust: 0 },
      'light intensity shower rain': { icon: WiNightAltRain, sizeAdjust: 0 },
      Drizzle: { icon: WiNightAltShowers, sizeAdjust: 0 },
      'thunderstorm with light rain': { icon: WiNightAltStormShowers, sizeAdjust: 0 },
      'thunderstorm with rain': { icon: WiNightAltStormShowers, sizeAdjust: 0 },
      Fog: { icon: WiNightFog, sizeAdjust: 0 },
      haze: { icon: WiNightFog, sizeAdjust: 0 },
      mist: { icon: WiNightFog, sizeAdjust: 0 },
      Snow: { icon: WiNightAltSnow, sizeAdjust: 0 },
      Smoke: { icon: WiSmoke, sizeAdjust: 0 },
      Dust: { icon: WiDust, sizeAdjust: 0 },
    },
  },
  day: {
    windy: {
      Clear: { icon: TbWind, sizeAdjust: 0 },
      'scattered clouds': { icon: WiDayCloudyWindy, sizeAdjust: 0 },
      'broken clouds': { icon: WiDayCloudyWindy, sizeAdjust: 0 },
      'few clouds': { icon: WiCloudyWindy, sizeAdjust: 20 },
      'overcast clouds': { icon: WiCloudyWindy, sizeAdjust: 20 },
      'light rain': { icon: WiDayRainWind, sizeAdjust: 0 },
      'heavy intensity rain': { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      'moderate rain': { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      'light intensity shower rain': { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      Drizzle: { icon: BsFillCloudDrizzleFill, sizeAdjust: 0 },
      'thunderstorm with light rain': { icon: BsFillCloudLightningRainFill, sizeAdjust: 0 },
      Fog: { icon: BsCloudFog, sizeAdjust: 0 },
      Snow: { icon: WiDaySnowWind, sizeAdjust: 0 },
      haze: { icon: BsFillCloudHazeFill, sizeAdjust: 0 },
      mist: { icon: TbMist, sizeAdjust: 0 },
      Smoke: { icon: WiSmoke, sizeAdjust: 0 },
      Dust: { icon: WiDust, sizeAdjust: 0 },
    },
    calm: {
      Clear: { icon: BsFillSunFill, sizeAdjust: 0 },
      'scattered clouds': { icon: BsFillCloudSunFill, sizeAdjust: 0 },
      'broken clouds': { icon: BsFillCloudSunFill, sizeAdjust: 0 },
      'few clouds': { icon: AiFillCloud, sizeAdjust: 0 },
      'overcast clouds': { icon: BsFillCloudsFill, sizeAdjust: 0 },
      'light rain': { icon: BsFillCloudRainFill, sizeAdjust: 0 },
      'heavy intensity rain': { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      'moderate rain': { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      'light intensity shower rain': { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      Drizzle: { icon: BsFillCloudDrizzleFill, sizeAdjust: 0 },
      'thunderstorm with light rain': { icon: BsFillCloudLightningRainFill, sizeAdjust: 0 },
      Fog: { icon: BsCloudFog, sizeAdjust: 0 },
      Snow: { icon: BsFillCloudSnowFill, sizeAdjust: 0 },
      haze: { icon: BsFillCloudHazeFill, sizeAdjust: 0 },
      mist: { icon: TbMist, sizeAdjust: 0 },
      Smoke: { icon: WiSmoke, sizeAdjust: 0 },
      Dust: { icon: WiDust, sizeAdjust: 0 },
    },
  },
};

export const WeatherIcons = memo(props => {
  const currentHourConversion = useMemo(() => {
    const d = new Date();
    const baseHour = props.hourConversion || d.getHours();
    return Math.round((baseHour * 3600 + d.getTimezoneOffset() * 60 + props.timeZone) / 3600);
  }, [props.timeZone, props.hourConversion]);

  const size = useMemo(
    () => (props.page === 'single' ? 200 : props.page === 'multiple' ? 50 : 85),
    [props.page]
  );

  const isNight = useMemo(
    () =>
      currentHourConversion <= props.sunriseHour || currentHourConversion >= props.sunsetHour + 1,
    [currentHourConversion, props.sunriseHour, props.sunsetHour]
  );

  const icon = useMemo(() => {
    const timeOfDay = isNight ? 'night' : 'day';
    const windCondition = props.windSpeed >= 8.0 ? 'windy' : 'calm';

    // Try to find an icon for the exact description
    let iconConfig = weatherIconsMap[timeOfDay]?.[windCondition]?.[props.description];

    // If no match for description, try to find by main weather
    if (!iconConfig) {
      iconConfig = weatherIconsMap[timeOfDay]?.[windCondition]?.[props.mainWeather];
    }

    if (iconConfig) {
      const IconComponent = iconConfig.icon;
      return (
        <IconComponent size={size + (iconConfig.sizeAdjust || 0)} color={props.color || 'white'} />
      );
    }

    // Fallback for any uncovered conditions
    console.warn(
      `No weather icon found for: ${timeOfDay}, ${windCondition}, ${props.mainWeather}, ${props.description}`
    );
    return <></>;
  }, [props.mainWeather, props.description, props.windSpeed, isNight, size, props.color]);

  return icon;
});

WeatherIcons.displayName = 'WeatherIcons';

export const TimeZoneShow = memo(props => {
  const timeZoneMap = {
    0: 'GMT',
    '-3600': 'GMT-1',
    '-7200': 'GMT-2',
    '-10800': 'GMT-3',
    '-14400': 'GMT-4',
    '-18000': 'GMT-5',
    '-21600': 'GMT-6',
    '-25200': 'GMT-7',
    '-28800': 'GMT-8',
    '-32400': 'GMT-9',
    '-36000': 'GMT-10',
    '-39600': 'GMT-11',
    '-43200': 'GMT-12',
    3600: 'GMT+1',
    7200: 'GMT+2',
    10800: 'GMT+3',
    14400: 'GMT+4',
    18000: 'GMT+5',
    19800: 'GMT+5:30',
    21600: 'GMT+6',
    25200: 'GMT+7',
    28800: 'GMT+8',
    32400: 'GMT+9',
    36000: 'GMT+10',
    39600: 'GMT+11',
    43200: 'GMT+12',
    46800: 'GMT+13',
    50400: 'GMT+14',
  };

  return timeZoneMap[props.timeZone] || '';
});

TimeZoneShow.displayName = 'TimeZoneShow';

export const SunriseSunsetTimes = props => {
  const sunriseTime = new Date(
    props.sunrise * 1000 + props.timeZone * 1000 + new Date().getTimezoneOffset() * 60 * 1000
  );
  const sunsetTime = new Date(
    props.sunset * 1000 + props.timeZone * 1000 + new Date().getTimezoneOffset() * 60 * 1000
  );

  return {
    sunriseHour: sunriseTime.getHours(),
    sunriseMinute: sunriseTime.getMinutes(),
    sunsetHour: sunsetTime.getHours(),
    sunsetMinute: sunsetTime.getMinutes(),
  };
};

SunriseSunsetTimes.displayName = 'SunriseSunsetTimes';

export const VisibilityDesc = memo(props => {
  const visibilityRanges = [
    { min: 0, max: 50, desc: 'Dense Fog' },
    { min: 50, max: 200, desc: 'Thick Fog' },
    { min: 200, max: 500, desc: 'Moderate Fog' },
    { min: 500, max: 1000, desc: 'Light Fog' },
    { min: 1000, max: 2000, desc: 'Thin Fog' },
    { min: 2000, max: 4000, desc: 'Haze' },
    { min: 4000, max: 10000, desc: 'Light Haze' },
    { min: 10000, max: 10000, desc: 'Clear' },
  ];

  const { visibility } = props;

  const visibilityDesc = visibilityRanges.find(
    range => visibility >= range.min && visibility <= range.max
  );

  return visibilityDesc ? visibilityDesc.desc : '';
});

VisibilityDesc.displayName = 'VisibilityDesc';

export const WindDirection = memo(props => {
  const windDirections = [
    { min: 348.75, max: 360, dir: 'N' },
    { min: 0, max: 11.25, dir: 'N' },
    { min: 11.26, max: 33.75, dir: 'NNE' },
    { min: 33.75, max: 56.25, dir: 'NE' },
    { min: 56.25, max: 78.75, dir: 'ENE' },
    { min: 78.75, max: 101.25, dir: 'E' },
    { min: 101.25, max: 123.75, dir: 'ESE' },
    { min: 123.75, max: 146.25, dir: 'SE' },
    { min: 146.25, max: 168.75, dir: 'SSE' },
    { min: 168.75, max: 191.25, dir: 'S' },
    { min: 191.25, max: 213.75, dir: 'SSW' },
    { min: 213.75, max: 236.25, dir: 'SW' },
    { min: 236.25, max: 258.75, dir: 'WSW' },
    { min: 258.75, max: 281.25, dir: 'W' },
    { min: 281.25, max: 303.75, dir: 'WNW' },
    { min: 303.75, max: 326.25, dir: 'NW' },
    { min: 326.25, max: 348.75, dir: 'NNW' },
  ];

  const { windDegrees } = props;

  const direction = windDirections.find(dir => windDegrees >= dir.min && windDegrees <= dir.max);

  return direction ? direction.dir : '';
});

WindDirection.displayName = 'WindDirection';

export const WindForce = memo(props => {
  const windForceRanges = [
    { min: 0, max: 0.3, force: 'Force 0' },
    { min: 0.3, max: 1.5, force: 'Force 1' },
    { min: 1.5, max: 3.3, force: 'Force 2' },
    { min: 3.3, max: 5.5, force: 'Force 3' },
    { min: 5.5, max: 8.0, force: 'Force 4' },
    { min: 8.0, max: 10.8, force: 'Force 5' },
    { min: 10.8, max: 13.9, force: 'Force 6' },
    { min: 13.9, max: 17.2, force: 'Force 7' },
    { min: 17.2, max: 20.7, force: 'Force 8' },
    { min: 20.7, max: 24.5, force: 'Force 9' },
    { min: 24.5, max: 28.4, force: 'Force 10' },
    { min: 28.4, max: 32.6, force: 'Force 11' },
    { min: 32.6, max: Infinity, force: 'Force 12' },
  ];

  const { windSpeed } = props;

  const force = windForceRanges.find(range => windSpeed >= range.min && windSpeed < range.max);

  return force ? force.force : '';
});

WindForce.displayName = 'WindForce';

// WindArrow component for displaying wind direction
export const WindArrow = memo(({ degrees }) => {
  return (
    <LiaLocationArrowSolid
      className="h-6 w-6 text-red-400"
      style={{
        transform: `rotate(${(degrees + 180) % 360}deg)`,
        transition: 'transform 0.5s ease-in-out',
      }}
    />
  );
});

WindArrow.displayName = 'WindArrow';

export const ShowWeather = memo(props => {
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

  const handleSubmitNormal = useCallback(
    e => {
      e.preventDefault();
      history(-1);
    },
    [history]
  );

  const handleSubmitAdvanced = useCallback(
    e => {
      e.preventDefault();
      history('/3HourForecast/' + props.lat + '/' + props.lon);
    },
    [history, props.lat, props.lon]
  );

  const WeatherDisplay = memo(() => (
    <div className="grow flex flex-col justify-center max-w-4xl mx-auto w-full px-4 py-6">
      {/* Back button - moved to top left */}
      <section className="-mb-2">
        <button
          className="flex items-center text-blue-400 hover:text-cyan-300 transition-colors duration-300 font-medium cursor-pointer group mb-3 sm:mb-0 sm:absolute self-start mx-4 sm:mx-0"
          onClick={props.choice === 'normal' ? handleSubmitNormal : handleSubmitAdvanced}
        >
          <FaArrowLeft className="h-5 w-5 mr-2 transform transition-transform duration-300 translate-x-1 group-hover:translate-x-0" />
          Back to Last Page
        </button>
      </section>

      {/* Location and time information */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          {props.name}, {props.country}
        </h1>

        {props.dayConversion && (
          <div className="mt-3">
            <p className="text-2xl font-medium text-white/90">{props.dayConversion}</p>
            <p className="text-xl mt-1 text-white/80">
              {(props.hourConversion > 23
                ? props.hourConversion - 24
                : props.hourConversion < 0
                  ? props.hourConversion + 24
                  : props.hourConversion
              )
                .toString()
                .padStart(2, '0')}
              :{props.timeNormalMinutes}
              <span className="text-gray-400 ml-2">
                (<TimeZoneShow timeZone={props.timeZone} />)
              </span>
            </p>
          </div>
        )}
      </section>

      {/* Main weather display card */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 mb-8 border border-blue-900/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row items-center mb-4">
          {/* Weather icon */}
          <div className="mb-4 md:mb-0 md:mr-8 relative">
            <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-full"></div>
            <div className="relative">
              <div className="h-[200px] flex items-center justify-center">
                <WeatherIcons
                  mainWeather={props.mainWeather}
                  windSpeed={props.windSpeed}
                  description={props.description}
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
            <p className="font-bold text-3xl mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
              {props.description.toUpperCase()}
            </p>
            <div className="flex items-center justify-center md:justify-start">
              <FaTemperatureHigh size={28} className="mr-3 text-amber-400" />
              <span className="text-6xl font-bold text-white">
                {Math.round(props.temperature)}°C
              </span>
            </div>
            <p className="mt-2 text-xl text-white/90">Feels like: {Math.round(props.tempFeel)}°C</p>
            <div className="flex mt-2 justify-center md:justify-start gap-5">
              <span className="flex items-center text-blue-300">
                <IoIosArrowDown className="h-5 w-5 mr-1 text-blue-300" />
                Min: {Math.round(props.tempMin)}°C
              </span>
              <span className="flex items-center text-red-300">
                <IoIosArrowUp className="h-5 w-5 mr-1 text-red-300" />
                Max: {Math.round(props.tempMax)}°C
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed weather information section */}
      <section className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 mb-8 border border-blue-900/30 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-5 pb-2 border-b border-blue-900/50 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Weather Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
              <WiHumidity size={38} className="mr-3 text-blue-400" />
              <div>
                <p className="font-medium text-blue-300">Humidity</p>
                <p className="text-lg font-bold">{props.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
              <WiBarometer size={38} className="mr-3 text-purple-400" />
              <div>
                <p className="font-medium text-purple-300">Pressure</p>
                <p className="text-lg font-bold">{props.pressure} hPa</p>
              </div>
            </div>

            <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
              <BsCloudFog size={32} className="mr-3 text-gray-400" />
              <div>
                <p className="font-medium text-gray-300">Visibility</p>
                <p className="text-lg font-bold">
                  {props.visibility >= 1000
                    ? `${props.visibility / 1000}km`
                    : `${props.visibility}m`}
                  <span className="text-sm text-gray-400 ml-1 font-normal">
                    (<VisibilityDesc visibility={props.visibility} />)
                  </span>
                </p>
              </div>
            </div>

            {props.rain !== undefined && (
              <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                <BsFillCloudRainFill size={32} className="mr-3 text-blue-300" />
                <div>
                  <p className="font-medium text-blue-200">Rain (last hour)</p>
                  <p className="text-lg font-bold">{props.rain} mm</p>
                </div>
              </div>
            )}

            {props.precipitation !== undefined && (
              <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
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
            <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
              <WiStrongWind size={38} className="mr-3 text-teal-400" />
              <div>
                <p className="font-medium text-teal-300">Wind</p>
                <p className="text-lg font-bold">
                  {props.windSpeed} m/s{' '}
                  <span className="text-sm text-gray-400 font-normal">
                    (<WindForce windSpeed={props.windSpeed} />)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
              <GiWindsock size={32} className="mr-3 text-cyan-400" />
              <div className="flex-1">
                <p className="font-medium text-cyan-300">Wind Direction</p>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-700/70 flex items-center justify-center mr-3 wind-arrow-container">
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
                <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                  <BsFillSunriseFill size={32} className="mr-3 text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-300">Sunrise</p>
                    <p className="text-lg font-bold">
                      {formatTimeDisplay(
                        props.localSunriseSunsetTimes.sunriseHour,
                        props.localSunriseSunsetTimes.sunriseMinute
                      )}
                      <span className="text-sm text-gray-400 ml-1 font-normal">
                        (<TimeZoneShow timeZone={props.timeZone} />)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/50 transition-all duration-300 hover:border-gray-700/50">
                  <BsFillSunsetFill size={32} className="mr-3 text-orange-400" />
                  <div>
                    <p className="font-medium text-orange-300">Sunset</p>
                    <p className="text-lg font-bold">
                      {formatTimeDisplay(
                        props.localSunriseSunsetTimes.sunsetHour,
                        props.localSunriseSunsetTimes.sunsetMinute
                      )}
                      <span className="text-sm text-gray-400 ml-1 font-normal">
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
                className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium cursor-pointer"
              >
                3 Hour Forecast
              </button>
            </form>

            <form onSubmit={props.handleSubmitDaily}>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium cursor-pointer"
              >
                Daily Forecast
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Navigation and update info */}
      <section className="text-center mt-auto">
        <p className="text-gray-400 text-sm">
          Last Updated:{' '}
          {props.choice === 'normal'
            ? `${timeUpdatedHourConversion.toString().padStart(2, '0')}:${timeUpdated.timeUpdatedMinute}`
            : `${currentHourConversion?.toString().padStart(2, '0')}:${props.currentTime.minute}`}{' '}
          (<TimeZoneShow timeZone={props.timeZone} />)
        </p>
      </section>
    </div>
  ));

  const ErrorDisplay = ({ message, countryName }) => (
    <div className="text-white bg-gradient-to-b from-black via-blue-950 to-black overflow-hidden flex flex-col min-h-screen items-center justify-center px-4 py-12">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8 max-w-md w-full text-center border border-blue-900/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <div className="mb-8">
          <BsFillCloudSlashFill size={60} className="mx-auto text-blue-400 mb-4" />
          <p className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            {message}
          </p>
          {countryName && (
            <p className="text-xl text-gray-300 mt-2">
              Country: <span className="font-medium">{countryName}</span>
            </p>
          )}
          <p className="text-gray-400 mt-3">Unable to retrieve weather data</p>
        </div>
        <Link
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium cursor-pointer"
          to="/weather"
        >
          Return to Weather Search
        </Link>
      </div>
    </div>
  );

  return (
    <div className="text-white bg-gradient-to-b from-black via-blue-950 to-black overflow-hidden flex flex-col min-h-screen">
      <Header />
      {props.loaded ? (
        props.mainWeather && <WeatherDisplay />
      ) : props.blocked ? (
        <ErrorDisplay message="The API is currently blocked" />
      ) : props.connectionError ? (
        <ErrorDisplay message="Please check your internet connection" />
      ) : props.loading ? (
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-8 rounded-xl border border-blue-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-sm w-full max-w-md">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-blue-700/70 mb-5 animate-spin"></div>
              <div className="h-7 w-64 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md mb-4"></div>
              <div className="h-5 w-48 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md"></div>
              <p className="mt-5 text-gray-400 font-medium">Loading weather data...</p>
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
});

ShowWeather.displayName = 'ShowWeather';

const formatTimeDisplay = (hour, minute) => {
  const adjustedHour = hour > 23 ? hour - 24 : hour < 0 ? hour + 24 : hour;
  return `${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const WeatherPopupContent = memo(props => {
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Function to fetch weather data for current location
  const fetchWeatherForCurrentLocation = useCallback(async () => {
    if (!props.userPos.latitude || !props.userPos.longitude) return;

    setIsLoadingWeather(true);
    try {
      // Replace with your actual weather API endpoint
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${props.userPos.latitude}&lon=${props.userPos.longitude}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Weather data fetch failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
        );
      }
      const data = await response.json();
      setCurrentLocationWeather(data);
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
  const popupStyles = useMemo(() => {
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
  }, [props.page, props.theme]);

  if (isLoadingWeather) {
    return (
      <div
        className="text-center p-3 font-medium"
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
        <p className="font-medium text-base mb-2">Failed to load weather data</p>
        <button
          onClick={fetchWeatherForCurrentLocation}
          className="mt-2 px-3 py-1.5 rounded-md font-medium hover:bg-blue-600 transition-colors"
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
      className="p-3 max-w-xs"
      style={
        props.page === 'map' ? { color: popupStyles.color, background: popupStyles.background } : {}
      }
    >
      {/* Location name with enhanced font */}
      <h3
        className="font-bold text-xl mb-1.5 tracking-tight"
        style={props.page === 'map' ? { color: popupStyles.heading } : { color: 'text-cyan-300' }}
      >
        {currentLocationWeather.name}
      </h3>

      {/* Temperature and weather icon section */}
      <div className="flex items-center mb-2">
        {currentLocationWeather.weather?.[0] && (
          <WeatherIcons
            mainWeather={currentLocationWeather.weather[0].main}
            windSpeed={currentLocationWeather.wind?.speed}
            description={currentLocationWeather.weather[0].description}
            timeZone={currentLocationWeather.timezone}
            sunriseHour={localSunriseSunsetTimes?.sunriseHour}
            sunsetHour={localSunriseSunsetTimes?.sunsetHour}
            page="multiple"
            color={props.page === 'map' ? popupStyles.color : props.color || 'white'}
          />
        )}
        <span
          className="text-3xl font-bold ml-2"
          style={props.page === 'map' ? { color: popupStyles.valueColor } : { color: 'white' }}
        >
          {Math.round(currentLocationWeather.main?.temp || 0)}°C
        </span>
      </div>

      {/* Weather description with improved styling */}
      <p
        className="capitalize font-medium text-lg mb-3"
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
            className="text-sm block mb-0.5"
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
            className="text-sm block mb-0.5"
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
            className="text-sm block mb-0.5"
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
            className="text-sm block mb-0.5"
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
            className="text-sm block mb-0.5"
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
            className="text-sm block mb-0.5"
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
          className="block mt-4 text-center font-bold text-sm py-1.5 transition-colors rounded-md"
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
});

WeatherPopupContent.displayName = 'WeatherPopupContent';
