import { useMemo, useCallback, useEffect, useState, memo } from 'react';
import { BsFillSunFill, BsFillCloudRainHeavyFill, BsFillCloudDrizzleFill, BsFillCloudLightningRainFill, BsFillCloudSnowFill, BsCloudFog, BsFillCloudRainFill, BsFillCloudsFill, BsFillCloudSunFill, BsFillCloudHazeFill } from 'react-icons/bs'; // * Sunny, Heavy Intensity Rain, Drizzle, Thunder and Rain, Snow, Fog, Light Rain, Overcast Clouds, Scattered Clouds, Haze
import { AiFillCloud } from 'react-icons/ai'; // * Cloudy
import { TbMist, TbWind } from 'react-icons/tb'; // * Mist, Windy Clear
import { WiCloudyWindy, WiDayCloudyWindy, WiDayRainWind, WiDaySnowWind, WiNightFog, WiNightCloudyWindy, WiNightAltPartlyCloudy, WiNightAltCloudy, WiNightAltRainMix, WiNightAltRain, WiNightAltShowers, WiNightAltStormShowers, WiNightAltSnow, WiNightAltRainWind } from 'react-icons/wi'; // * Windy Cloudy, Windy Scattered/Broken, Windy Light Rain, Windy Snow, Night Fog, Night Windy, Broken/Scattered Clouds Night, Cloudy Night, Light Rain Night, Rain Night, Drizzle Night, Thunderstorm with Rain Night, Night Snow, Windy Rain Night
import { MdModeNight } from 'react-icons/md'; // * Night Clear
import { Header } from './header';
import { Footer } from './footer';
import { useNavigate, Link } from 'react-router-dom';
import { FaTemperatureHigh } from 'react-icons/fa'; // * temperature icon
import { WiHumidity, WiStrongWind, WiBarometer, WiSmoke, WiDust } from 'react-icons/wi'; // * humidity icon, wind icon, barometer, smoke icon
import { BsFillSunriseFill, BsFillSunsetFill } from 'react-icons/bs' // * sunrise icon, sunset icon
import { GiWindsock } from "react-icons/gi"; // * wind sock icon

// Weather icons mapping configuration
const weatherIconsMap = {
  night: {
    windy: {
      "Clear": { icon: MdModeNight, sizeAdjust: 0 },
      "scattered clouds": { icon: WiNightCloudyWindy, sizeAdjust: 20 },
      "broken clouds": { icon: WiNightCloudyWindy, sizeAdjust: 20 },
      "few clouds": { icon: WiNightCloudyWindy, sizeAdjust: 17 },
      "overcast clouds": { icon: WiNightCloudyWindy, sizeAdjust: 17 },
      "light rain": { icon: WiNightAltRainWind, sizeAdjust: 0 },
      "heavy intensity rain": { icon: WiNightAltRainWind, sizeAdjust: 0 },
      "moderate rain": { icon: WiNightAltRainWind, sizeAdjust: 0 },
      "light intensity shower rain": { icon: WiNightAltRainWind, sizeAdjust: 0 },
      "Drizzle": { icon: WiNightAltRainWind, sizeAdjust: 0 },
      "thunderstorm with light rain": { icon: WiNightAltStormShowers, sizeAdjust: 0 },
      "Fog": { icon: WiNightFog, sizeAdjust: 0 },
      "haze": { icon: WiNightFog, sizeAdjust: 0 },
      "mist": { icon: WiNightFog, sizeAdjust: 0 },
      "Snow": { icon: WiNightAltSnow, sizeAdjust: 0 },
      "Smoke": { icon: WiSmoke, sizeAdjust: 0 },
      "Dust": { icon: WiDust, sizeAdjust: 0 },
    },
    calm: {
      "Clear": { icon: MdModeNight, sizeAdjust: 0 },
      "scattered clouds": { icon: WiNightAltPartlyCloudy, sizeAdjust: 30 },
      "broken clouds": { icon: WiNightAltPartlyCloudy, sizeAdjust: 30 },
      "few clouds": { icon: WiNightAltCloudy, sizeAdjust: 20 },
      "overcast clouds": { icon: WiNightAltCloudy, sizeAdjust: 20 },
      "light rain": { icon: WiNightAltRainMix, sizeAdjust: 0 },
      "heavy intensity rain": { icon: WiNightAltRain, sizeAdjust: 0 },
      "moderate rain": { icon: WiNightAltRain, sizeAdjust: 0 },
      "light intensity shower rain": { icon: WiNightAltRain, sizeAdjust: 0 },
      "Drizzle": { icon: WiNightAltShowers, sizeAdjust: 0 },
      "thunderstorm with light rain": { icon: WiNightAltStormShowers, sizeAdjust: 0 },
      "thunderstorm with rain": { icon: WiNightAltStormShowers, sizeAdjust: 0 },
      "Fog": { icon: WiNightFog, sizeAdjust: 0 },
      "haze": { icon: WiNightFog, sizeAdjust: 0 },
      "mist": { icon: WiNightFog, sizeAdjust: 0 },
      "Snow": { icon: WiNightAltSnow, sizeAdjust: 0 },
      "Smoke": { icon: WiSmoke, sizeAdjust: 0 },
      "Dust": { icon: WiDust, sizeAdjust: 0 },
    }
  },
  day: {
    windy: {
      "Clear": { icon: TbWind, sizeAdjust: 0 },
      "scattered clouds": { icon: WiDayCloudyWindy, sizeAdjust: 0 },
      "broken clouds": { icon: WiDayCloudyWindy, sizeAdjust: 0 },
      "few clouds": { icon: WiCloudyWindy, sizeAdjust: 20 },
      "overcast clouds": { icon: WiCloudyWindy, sizeAdjust: 20 },
      "light rain": { icon: WiDayRainWind, sizeAdjust: 0 },
      "heavy intensity rain": { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      "moderate rain": { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      "light intensity shower rain": { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      "Drizzle": { icon: BsFillCloudDrizzleFill, sizeAdjust: 0 },
      "thunderstorm with light rain": { icon: BsFillCloudLightningRainFill, sizeAdjust: 0 },
      "Fog": { icon: BsCloudFog, sizeAdjust: 0 },
      "Snow": { icon: WiDaySnowWind, sizeAdjust: 0 },
      "haze": { icon: BsFillCloudHazeFill, sizeAdjust: 0 },
      "mist": { icon: TbMist, sizeAdjust: 0 },
      "Smoke": { icon: WiSmoke, sizeAdjust: 0 },
      "Dust": { icon: WiDust, sizeAdjust: 0 },
    },
    calm: {
      "Clear": { icon: BsFillSunFill, sizeAdjust: 0 },
      "scattered clouds": { icon: BsFillCloudSunFill, sizeAdjust: 0 },
      "broken clouds": { icon: BsFillCloudSunFill, sizeAdjust: 0 },
      "few clouds": { icon: AiFillCloud, sizeAdjust: 0 },
      "overcast clouds": { icon: BsFillCloudsFill, sizeAdjust: 0 },
      "light rain": { icon: BsFillCloudRainFill, sizeAdjust: 0 },
      "heavy intensity rain": { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      "moderate rain": { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      "light intensity shower rain": { icon: BsFillCloudRainHeavyFill, sizeAdjust: 0 },
      "Drizzle": { icon: BsFillCloudDrizzleFill, sizeAdjust: 0 },
      "thunderstorm with light rain": { icon: BsFillCloudLightningRainFill, sizeAdjust: 0 },
      "Fog": { icon: BsCloudFog, sizeAdjust: 0 },
      "Snow": { icon: BsFillCloudSnowFill, sizeAdjust: 0 },
      "haze": { icon: BsFillCloudHazeFill, sizeAdjust: 0 },
      "mist": { icon: TbMist, sizeAdjust: 0 },
      "Smoke": { icon: WiSmoke, sizeAdjust: 0 },
      "Dust": { icon: WiDust, sizeAdjust: 0 },
    }
  }
};

export const WeatherIcons = memo((props) => {
  const currentHourConversion = useMemo(() => {
    const d = new Date();
    const baseHour = props.hourConversion || d.getHours();
    return Math.round(((baseHour * 3600 + d.getTimezoneOffset() * 60) + props.timeZone) / 3600);
  }, [props.timeZone, props.hourConversion]);
  
  const size = useMemo(() => 
    props.page === 'single' ? 200 : props.page === 'multiple' ? 50 : 85, 
    [props.page]
  );
  
  const isNight = useMemo(() => 
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
      return <IconComponent size={size + (iconConfig.sizeAdjust || 0)} color={props.color || 'white'} />;
    }
    
    // Fallback for any uncovered conditions
    console.warn(`No weather icon found for: ${timeOfDay}, ${windCondition}, ${props.mainWeather}, ${props.description}`);
    return <></>;
  }, [props.mainWeather, props.description, props.windSpeed, isNight, size, props.color]);

  return icon;
});

WeatherIcons.displayName = 'WeatherIcons';

export const TimeZoneShow = memo((props) => {
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
    50400: 'GMT+14'
  };

  return timeZoneMap[props.timeZone] || '';
});

TimeZoneShow.displayName = 'TimeZoneShow';

export const SunriseSunsetTimes = (props) => {
  const sunriseTime = new Date((props.sunrise * 1000) + (props.timeZone * 1000) + (new Date().getTimezoneOffset() * 60 * 1000));
  const sunsetTime = new Date((props.sunset * 1000) + (props.timeZone * 1000) + (new Date().getTimezoneOffset() * 60 * 1000));

  return {
    sunriseHour: sunriseTime.getHours(),
    sunriseMinute: sunriseTime.getMinutes(),
    sunsetHour: sunsetTime.getHours(),
    sunsetMinute: sunsetTime.getMinutes(),
  };
}

SunriseSunsetTimes.displayName = 'SunriseSunsetTimes';

export const VisibilityDesc = memo((props) => {
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

export const WindDirection = memo((props) => {
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
    { min: 326.25, max: 348.75, dir: 'NNW' }
  ];

  const { windDegrees } = props;
  
  const direction = windDirections.find(
    dir => windDegrees >= dir.min && windDegrees <= dir.max
  );
  
  return direction ? direction.dir : '';
});

WindDirection.displayName = 'WindDirection';

export const WindForce = memo((props) => {
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
    { min: 32.6, max: Infinity, force: 'Force 12' }
  ];

  const { windSpeed } = props;
  
  const force = windForceRanges.find(
    range => windSpeed >= range.min && windSpeed < range.max
  );
  
  return force ? force.force : '';
});

WindForce.displayName = 'WindForce';

export const ShowWeather = memo((props) => {
  const timeUpdated = useMemo(() => ({
    timeUpdatedHour: String(new Date(props.timeUpdatedUNIX * 1000).getHours()).padStart(2, '0'),
    timeUpdatedMinute: String(new Date(props.timeUpdatedUNIX * 1000).getMinutes()).padStart(2, '0'),
  }), [props.timeUpdatedUNIX]);

  const timeUpdatedHourConversion = useMemo(() => {
    const convertedHour = Math.round(((timeUpdated.timeUpdatedHour * 3600 + new Date().getTimezoneOffset() * 60) + props.timeZone) / 3600);
    // Handle hour wrapping for 24-hour format
    if (convertedHour > 23) return convertedHour - 24;
    if (convertedHour < 0) return convertedHour + 24;
    return convertedHour;
  }, [timeUpdated.timeUpdatedHour, props.timeZone]);

  const currentHourConversion = useMemo(() => 
    props.choice !== 'normal' 
      ? Math.round(((props.currentTime.hour * 3600 + new Date().getTimezoneOffset() * 60) + props.timeZone) / 3600) 
      : null,
    [props.choice, props.currentTime?.hour, props.timeZone]
  );

  const history = useNavigate();

  const handleSubmitNormal = useCallback((e) => {
    e.preventDefault();
    history(-1);
  }, [history]);

  const handleSubmitAdvanced = useCallback((e) => {
    e.preventDefault();
    history('/3HourForecast/' + props.lat + '/' + props.lon);
  }, [history, props.lat, props.lon]);

  const WeatherDisplay = memo(() => (
    <div className="text-center flex-grow flex flex-col justify-center">
      {props.dayConversion &&
        <section className="mb-10 mt-7">
          <p className="mx-auto font-bold text-4xl underline">{props.dayConversion}</p>
          <p className="font-bold text-4xl mx-auto underline mt-5">{(props.hourConversion > 23 ? props.hourConversion - 24 : props.hourConversion < 0 ? props.hourConversion + 24 : props.hourConversion).toString().padStart(2, '0')}:{props.timeNormalMinutes} (<TimeZoneShow timeZone={props.timeZone} />)</p>
        </section>
      }
      <section className="mb-4 mx-auto">
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
      </section>
      <section className="text-lg">
        <p className="underline text-3xl font-bold">{props.name}, {props.country}</p>
        <p className="font-bold text-3xl mt-4">{props.description.toUpperCase()}</p>
        <p className="mt-1"><FaTemperatureHigh size={20} className="inline mr-2" />Temperature: {Math.round(props.temperature)}°C</p>
        <p>Feels like: {Math.round(props.tempFeel)}°C</p>
        <p>Min: {Math.round(props.tempMin)}°C   Max: {Math.round(props.tempMax)}°C</p>
        <p><WiHumidity size={27} className="inline" />Humidity: {props.humidity}%</p>
        <p><WiStrongWind size={27} className="inline mr-2" />Wind Speed: {props.windSpeed} m/s (<WindForce windSpeed={props.windSpeed} />)   <GiWindsock size={23} className="inline mr-2" />Wind Direction: <WindDirection windDegrees={props.windDegrees} /> @ {props.windDegrees}°</p>
        {props.precipitation !== undefined && <p>Precipitation: {props.precipitation}%</p>}
        <p><WiBarometer size={30} className="inline mr-1" />Pressure: {props.pressure} hPa</p>
        <p>Visibility: {props.visibility >= 1000 ? `${props.visibility / 1000}km` : `${props.visibility}m`} (<VisibilityDesc visibility={props.visibility} />)</p>
        {props.localSunriseSunsetTimes &&
          <p><BsFillSunriseFill size={25} className="inline mr-2" />Sunrise: {(props.localSunriseSunsetTimes.sunriseHour > 23 ? props.localSunriseSunsetTimes.sunriseHour - 24 : props.localSunriseSunsetTimes.sunriseHour).toString().padStart(2, '0')}:{props.localSunriseSunsetTimes.sunriseMinute.toString().padStart(2, '0')} (<TimeZoneShow timeZone={props.timeZone} />)   <BsFillSunsetFill size={25} className="inline mr-2" />Sunset: {(props.localSunriseSunsetTimes.sunsetHour < 0 ? props.localSunriseSunsetTimes.sunsetHour + 24 : props.localSunriseSunsetTimes.sunsetHour).toString().padStart(2, '0')}:{props.localSunriseSunsetTimes.sunsetMinute.toString().padStart(2, '0')} (<TimeZoneShow timeZone={props.timeZone} />)</p>
        }
        {props.rain !== undefined && <p>Rain in last hour: {props.rain} mm</p>}
      </section>
      {props.choice === "normal" &&
        <div className="flex mx-auto">
          <form onSubmit={props.handleSubmit3Hour}>
            <button type="submit" className="text-lg underline mt-5 font-bold hover:text-cyan-300 duration-300">Show 3 hour forecast</button>
          </form>
          <form onSubmit={props.handleSubmitDaily} className="ml-10">
            <button type="submit" className="text-lg underline mt-5 font-bold hover:text-cyan-300 duration-300">Show daily forecast</button>
          </form>
        </div>
      }
      <button className="rounded-md border h-8 text-xl my-8 font-bold w-24 mx-auto" onClick={props.choice ==="normal" ? handleSubmitNormal : handleSubmitAdvanced} >Go Back</button>
      {props.choice === "normal" ?
        <p className="flex mx-auto underline mb-7">Last Updated: {timeUpdatedHourConversion.toString().padStart(2, '0')}:{timeUpdated.timeUpdatedMinute} (<TimeZoneShow timeZone={props.timeZone} />)</p> :
        <p className="flex mx-auto underline mb-7">Last Updated: {currentHourConversion?.toString().padStart(2, '0')}:{props.currentTime.minute} (<TimeZoneShow timeZone={props.timeZone} />)</p>
      }
    </div>
  ));

  const ErrorDisplay = ({ message }) => (
    <div className="text-center bg-black min-h-screen flex flex-col justify-center">
      <p className="text-3xl uppercase font-bold">{message}</p>
      <Link className="text-xl mt-8 underline uppercase font-bold hover:text-cyan-300 duration-300" to="/weather">Go Back</Link>
    </div>
  );

  return (
    <div className="text-white bg-black flex flex-col min-h-screen">
      <Header />
      {props.loaded ? (
        props.mainWeather && 
          <WeatherDisplay />
      ) : props.blocked ? (
        <ErrorDisplay message="The API is currently blocked" />
      ) : props.connectionError ? (
        <ErrorDisplay message="Please check your internet connection" />
      ) : props.loading ? (
        <div className="text-center bg-black min-h-screen flex flex-col justify-center">
          <p className="font-bold text-3xl">Loading...</p>
        </div>
      ) : !props.mainWeather ? (
        <ErrorDisplay message={`The city you have entered ('${props.city}') has not been found`} />
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

export const WeatherPopupContent = memo((props) => {
  const [ currentLocationWeather, setCurrentLocationWeather ] = useState(null);
  const [ isLoadingWeather, setIsLoadingWeather ] = useState(false);

  // Function to fetch weather data for current location
  const fetchWeatherForCurrentLocation = useCallback(async () => {
    if (!props.userPos.latitude || !props.userPos.longitude) return;
    
    setIsLoadingWeather(true);
    try {
        // Replace with your actual weather API endpoint
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${props.userPos.latitude}&lon=${props.userPos.longitude}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Weather data fetch failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }
        const data = await response.json();
        setCurrentLocationWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
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
      if (currentLocationWeather?.sys?.sunrise && currentLocationWeather?.sys?.sunset && currentLocationWeather?.timezone !== undefined) {
        return SunriseSunsetTimes({
          sunrise: currentLocationWeather.sys.sunrise,
          sunset: currentLocationWeather.sys.sunset,
          timeZone: currentLocationWeather.timezone
        });
      }
      return null;
  }, [currentLocationWeather]);

  if (isLoadingWeather) {
      return <div className="text-center p-2">Loading weather data...</div>;
  }
  
  if (!currentLocationWeather) {
      return (
          <div className="p-2">
              <p>Failed to load weather data</p>
              <button 
                  onClick={fetchWeatherForCurrentLocation}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                  Retry
              </button>
          </div>
      );
  }
  
  return (
      <div className="p-2 max-w-xs">
          <h3 className="font-bold text-lg">{currentLocationWeather.name}</h3>
          <div className="flex items-center">
              {currentLocationWeather.weather?.[0] && (
                  <WeatherIcons
                      mainWeather={currentLocationWeather.weather[0].main}
                      windSpeed={currentLocationWeather.wind?.speed}
                      description={currentLocationWeather.weather[0].description}
                      timeZone={currentLocationWeather.timezone}
                      sunriseHour={localSunriseSunsetTimes?.sunriseHour}
                      sunsetHour={localSunriseSunsetTimes?.sunsetHour}
                      page="multiple"
                      color="black"
                  />
              )}
              <span className="text-2xl ml-2">{Math.round(currentLocationWeather.main?.temp || 0)}°C</span>
          </div>
          <p className="capitalize">{currentLocationWeather.weather?.[0]?.description}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>Humidity: {currentLocationWeather.main?.humidity ?? '--'}%</div>
              <div>Wind: {currentLocationWeather.wind?.speed 
                ? (
                    <>
                      {Math.round(currentLocationWeather.wind.speed)} m/s (<WindForce windSpeed={currentLocationWeather.wind.speed} />)
                    </>
                  ) 
                : '--'}
              </div>
              <div>Pressure: {currentLocationWeather.main?.pressure ? `${currentLocationWeather.main.pressure} hPa` : '--'}</div>
              <div>Visibility: <br/>{currentLocationWeather.visibility ? (currentLocationWeather.visibility >= 1000 ? `${currentLocationWeather.visibility / 1000} km` : `${currentLocationWeather.visibility} m`) : '--'}</div>
              <div>Sunrise: {localSunriseSunsetTimes ? formatTimeDisplay(localSunriseSunsetTimes.sunriseHour, localSunriseSunsetTimes.sunriseMinute) : '--:--'}</div>
              <div>Sunset: {localSunriseSunsetTimes ? formatTimeDisplay(localSunriseSunsetTimes.sunsetHour, localSunriseSunsetTimes.sunsetMinute) : '--:--'}</div>
          </div>
          <Link 
              className='block mt-3 text-center font-bold text-sm underline' 
              style={{ color: 'inherit' }} 
              to={'/weatherLocation/' + props.userPos.latitude + '/' + props.userPos.longitude}
          >
              View detailed forecast
          </Link>
      </div>
  );
});

WeatherPopupContent.displayName = 'WeatherPopupContent';