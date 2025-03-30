import React, { useMemo, useCallback } from 'react';
import { BsFillSunFill, BsFillCloudRainHeavyFill, BsFillCloudDrizzleFill, BsFillCloudLightningRainFill, BsFillCloudSnowFill, BsCloudFog, BsFillCloudRainFill, BsFillCloudsFill, BsFillCloudSunFill, BsFillCloudHazeFill } from 'react-icons/bs'; // * Sunny, Heavy Intensity Rain, Drizzle, Thunder and Rain, Snow, Fog, Light Rain, Overcast Clouds, Scattered Clouds, Haze
import { AiFillCloud } from 'react-icons/ai'; // * Cloudy
import { TbMist, TbWind } from 'react-icons/tb'; // * Mist, Windy Clear
import { WiCloudyWindy, WiDayCloudyWindy, WiDayRainWind, WiDaySnowWind, WiNightFog, WiNightCloudyWindy, WiNightAltPartlyCloudy, WiNightAltCloudy, WiNightAltRainMix, WiNightAltRain, WiNightAltShowers, WiNightAltStormShowers, WiNightAltSnow, WiNightAltRainWind } from 'react-icons/wi'; // * Windy Cloudy, Windy Scattered/Broken, Windy Light Rain, Windy Snow, Night Fog, Night Windy, Broken/Scattered Clouds Night, Cloudy Night, Light Rain Night, Rain Night, Drizzle Night, Thunderstorm with Rain Night, Night Snow, Windy Rain Night
import { MdModeNight } from 'react-icons/md'; // * Night Clear
import { Header } from './header';
import { Footer } from './footer';
import { useNavigate } from 'react-router-dom';
import { FaTemperatureHigh } from 'react-icons/fa'; // * temperature icon
import { WiHumidity, WiStrongWind, WiBarometer, WiSmoke, WiDust } from 'react-icons/wi'; // * humidity icon, wind icon, barometer, smoke icon
import { BsFillSunriseFill, BsFillSunsetFill } from 'react-icons/bs' // * sunrise icon, sunset icon
import { GiWindsock } from "react-icons/gi"; // * wind sock icon

export const WeatherIcons = React.memo((props) => {
  const currentHourConversion = useMemo(() => {
    const d = new Date();
    const baseHour = props.page === 'single' ? d.getHours() : props.hourConversion;
    return Math.round(((baseHour * 3600 + d.getTimezoneOffset() * 60) + props.timeZone) / 3600);
  }, [props.page, props.timeZone, props.hourConversion]);
  
  const size = useMemo(() => 
    props.page === 'single' ? 200 : props.page === 'multiple' ? 50 : 85, 
    [props.page]
  );
  
  const isNight = useMemo(() => 
    currentHourConversion <= props.sunriseHour || currentHourConversion >= props.sunsetHour + 1, 
    [currentHourConversion, props.sunriseHour, props.sunsetHour]
  );

  const icon = useMemo(() => {
    const isWindy = props.windSpeed >= 8.0;

    if (isNight) {
      if (isWindy) {
        if (props.mainWeather === "Clear") return <MdModeNight size={size} color="white" />;
        if (["scattered clouds", "broken clouds"].includes(props.description)) return <WiNightCloudyWindy size={size + 20} color="white" />;
        if (["few clouds", "overcast clouds"].includes(props.description)) return <WiNightCloudyWindy size={size + 17} color="white" />;
        if (["light rain", "heavy intensity rain", "moderate rain", "light intensity shower rain"].includes(props.description) || props.mainWeather === "Drizzle") return <WiNightAltRainWind size={size} color="white" />;
        if (props.description === "thunderstorm with light rain") return <WiNightAltStormShowers size={size} color="white" />;
        if (props.mainWeather === "Fog" || ["haze", "mist"].includes(props.description)) return <WiNightFog size={size} color="white" />;
        if (props.mainWeather === "Snow") return <WiNightAltSnow size={size} color="white" />;
        if (props.mainWeather === "Smoke") return <WiSmoke size={size} color="white" />;
        if (props.mainWeather === "Dust") return <WiDust size={size} color="white" />;
      } else {
        if (props.mainWeather === "Clear") return <MdModeNight size={size} color="white" />;
        if (["scattered clouds", "broken clouds"].includes(props.description)) return <WiNightAltPartlyCloudy size={size + 30} color="white" />;
        if (["few clouds", "overcast clouds"].includes(props.description)) return <WiNightAltCloudy size={size + 20} color="white" />;
        if (props.description === "light rain") return <WiNightAltRainMix size={size} color="white" />;
        if (["heavy intensity rain", "moderate rain", "light intensity shower rain"].includes(props.description)) return <WiNightAltRain size={size} color="white" />;
        if (props.mainWeather === "Drizzle") return <WiNightAltShowers size={size} color="white" />;
        if (["thunderstorm with light rain", "thunderstorm with rain"].includes(props.description)) return <WiNightAltStormShowers size={size} color="white" />;
        if (props.mainWeather === "Fog" || ["haze", "mist"].includes(props.description)) return <WiNightFog size={size} color="white" />;
        if (props.mainWeather === "Snow") return <WiNightAltSnow size={size} color="white" />;
        if (props.mainWeather === "Smoke") return <WiSmoke size={size} color="white" />;
        if (props.mainWeather === "Dust") return <WiDust size={size} color="white" />;
      }
    } else {
      if (isWindy) {
        if (props.mainWeather === "Clear") return <TbWind size={size} color="white" />;
        if (["scattered clouds", "broken clouds"].includes(props.description)) return <WiDayCloudyWindy size={size} color="white" />;
        if (["few clouds", "overcast clouds"].includes(props.description)) return <WiCloudyWindy size={size + 20} color="white" />;
        if (props.description === "light rain") return <WiDayRainWind size={size} color="white" />;
        if (["heavy intensity rain", "moderate rain", "light intensity shower rain"].includes(props.description)) return <BsFillCloudRainHeavyFill size={size} color="white" />;
        if (props.mainWeather === "Drizzle") return <BsFillCloudDrizzleFill size={size} color="white" />;
        if (props.description === "thunderstorm with light rain") return <BsFillCloudLightningRainFill size={size} color="white" />;
        if (props.mainWeather === "Fog") return <BsCloudFog size={size} color="white" />;
        if (props.mainWeather === "Snow") return <WiDaySnowWind size={size} color="white" />;
        if (props.description === "haze") return <BsFillCloudHazeFill size={size} color="white" />;
        if (props.description === "mist") return <TbMist size={size} color="white" />;
        if (props.mainWeather === "Smoke") return <WiSmoke size={size} color="white" />;
        if (props.mainWeather === "Dust") return <WiDust size={size} color="white" />;
      } else {
        if (props.mainWeather === "Clear") return <BsFillSunFill size={size} color="white" />;
        if (["scattered clouds", "broken clouds"].includes(props.description)) return <BsFillCloudSunFill size={size} color="white" />;
        if (props.description === "few clouds") return <AiFillCloud size={size} color="white" />;
        if (props.description === "overcast clouds") return <BsFillCloudsFill size={size} color="white" />;
        if (props.description === "light rain") return <BsFillCloudRainFill size={size} color="white" />;
        if (["heavy intensity rain", "moderate rain", "light intensity shower rain"].includes(props.description)) return <BsFillCloudRainHeavyFill size={size} color="white" />;
        if (props.mainWeather === "Drizzle") return <BsFillCloudDrizzleFill size={size} color="white" />;
        if (props.description === "thunderstorm with light rain") return <BsFillCloudLightningRainFill size={size} color="white" />;
        if (props.mainWeather === "Fog") return <BsCloudFog size={size} color="white" />;
        if (props.mainWeather === "Snow") return <BsFillCloudSnowFill size={size} color="white" />;
        if (props.description === "haze") return <BsFillCloudHazeFill size={size} color="white" />;
        if (props.description === "mist") return <TbMist size={size} color="white" />;
        if (props.mainWeather === "Smoke") return <WiSmoke size={size} color="white" />;
        if (props.mainWeather === "Dust") return <WiDust size={size} color="white" />;
      }
    }
    return <></>;
  }, [props.mainWeather, props.description, props.windSpeed, isNight, size]);

  return icon;
});

export const TimeZoneShow = React.memo((props) => {
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

export const VisibilityDesc = React.memo((props) => {
    if (props.visibility < 50) {
      return 'Dense Fog';
    } else if (props.visibility >= 50 && props.visibility < 200) {
      return 'Thick Fog';
    } else if (props.visibility >= 200 && props.visibility < 500) {
      return 'Moderate Fog';
    } else if (props.visibility >= 500 && props.visibility < 1000) {
      return 'Light Fog';
    } else if (props.visibility >= 1000 && props.visibility < 2000) {
      return 'Thin Fog';
    } else if (props.visibility >= 2000 && props.visibility < 4000) {
      return 'Haze';
    } else if (props.visibility >= 4000 && props.visibility < 10000) {
      return 'Light Haze';
    } else if (props.visibility === 10000) {
      return 'Clear';
    } else {
      return '';
    }
});


export const WindDirection = React.memo((props) => {
  if ((props.windDegrees >= 0 && props.windDegrees <= 11.25) || (props.windDegrees  > 348.75)) {
    return 'N';
  } else if (props.windDegrees >= 11.26 && props.windDegrees < 33.75) {
    return 'NNE';
  } else if (props.windDegrees >= 33.75 && props.windDegrees < 56.25) {
    return 'NE';
  } else if (props.windDegrees >= 56.25 && props.windDegrees < 78.75) {
    return 'ENE';
  } else if (props.windDegrees >= 78.75 && props.windDegrees < 101.25) {
    return 'E';
  } else if (props.windDegrees >= 101.25 && props.windDegrees < 123.75) {
    return 'ESE';
  } else if (props.windDegrees >= 123.75 && props.windDegrees < 146.25) {
    return 'SE';
  } else if (props.windDegrees >= 146.25 && props.windDegrees < 168.75) {
    return 'SSE';
  } else if (props.windDegrees >= 168.75 && props.windDegrees < 191.25) {
    return 'S';
  } else if (props.windDegrees >= 191.25 && props.windDegrees < 213.75) {
    return 'SSW';
  } else if (props.windDegrees >= 213.75 && props.windDegrees < 236.25) {
    return 'SW';
  } else if (props.windDegrees >= 236.25 && props.windDegrees < 258.75) {
    return 'WSW';
  } else if (props.windDegrees >= 258.75 && props.windDegrees < 281.25) {
    return 'W';
  } else if (props.windDegrees >= 281.25 && props.windDegrees < 303.75) {
    return 'WNW';
  } else if (props.windDegrees >= 303.75 && props.windDegrees < 326.25) {
    return 'NW';
  } else if (props.windDegrees >= 326.25 && props.windDegrees < 348.75) {
    return 'NNW';
  } else {
    return '';
  }
});

export const WindForce = React.memo((props) => {
  if (props.windSpeed < 0.3) {
    return 'Force 0';
  } else if (props.windSpeed >= 0.3 && props.windSpeed < 1.5) {
    return 'Force 1';
  } else if (props.windSpeed >= 1.5 && props.windSpeed < 3.3) {
    return 'Force 2';
  } else if (props.windSpeed >= 3.3 && props.windSpeed < 5.5) {
    return 'Force 3';
  } else if (props.windSpeed >= 5.5 && props.windSpeed < 8.0) {
    return 'Force 4';
  } else if (props.windSpeed >= 8.0 && props.windSpeed < 10.8) {
    return 'Force 5';
  } else if (props.windSpeed >= 10.8 && props.windSpeed < 13.9) {
    return 'Force 6';
  } else if (props.windSpeed >= 13.9 && props.windSpeed < 17.2) {
    return 'Force 7';
  } else if (props.windSpeed >= 17.2 && props.windSpeed < 20.7) {
    return 'Force 8';
  } else if (props.windSpeed >= 20.7 && props.windSpeed < 24.5) {
    return 'Force 9';
  } else if (props.windSpeed >= 24.5 && props.windSpeed < 28.4) {
    return 'Force 10';
  } else if (props.windSpeed >= 28.4 && props.windSpeed < 32.6) {
    return 'Force 11';
  } else if (props.windSpeed >= 32.6) {
    return 'Force 12';
  } else {
    return '';
  }
});

export const ShowWeather = (props) => {
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

  const NormalWeather = React.memo(() => (
    <div className="text-center flex-grow flex flex-col justify-center">
      <section className="mx-auto mb-4">
        <WeatherIcons
          mainWeather={props.mainWeather}
          windSpeed={props.windSpeed}
          description={props.description}
          timeZone={props.timeZone}
          sunriseHour={props.localSunriseSunsetTimes?.sunriseHour}
          sunsetHour={props.localSunriseSunsetTimes?.sunsetHour}
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
        <p><WiBarometer size={30} className="inline mr-1" />Pressure: {props.pressure} hPa</p>
        <p>Visibility: {props.visibility >= 1000 ? `${props.visibility / 1000}km` : `${props.visibility}m`} (<VisibilityDesc visibility={props.visibility} />)</p>
        <p><BsFillSunriseFill size={25} className="inline mr-2" />Sunrise: {(props.localSunriseSunsetTimes.sunriseHour > 23 ? props.localSunriseSunsetTimes.sunriseHour - 24 : props.localSunriseSunsetTimes.sunriseHour).toString().padStart(2, '0')}:{props.localSunriseSunsetTimes.sunriseMinute.toString().padStart(2, '0')} (<TimeZoneShow timeZone={props.timeZone} />)   <BsFillSunsetFill size={25} className="inline mr-2" />Sunset: {(props.localSunriseSunsetTimes.sunsetHour < 0 ? props.localSunriseSunsetTimes.sunsetHour + 24 : props.localSunriseSunsetTimes.sunsetHour).toString().padStart(2, '0')}:{props.localSunriseSunsetTimes.sunsetMinute.toString().padStart(2, '0')} (<TimeZoneShow timeZone={props.timeZone} />)</p>
        {props.rain !== undefined && <p>Rain in last hour: {props.rain} mm</p>}
      </section>
      <div className="flex mx-auto">
        <form onSubmit={props.handleSubmit3Hour}>
          <button type="submit" className="text-lg underline mt-5 font-bold hover:text-cyan-300 duration-300">Show 3 hour forecast</button>
        </form>
        <form onSubmit={props.handleSubmitDaily} className="ml-10">
          <button type="submit" className="text-lg underline mt-5 font-bold hover:text-cyan-300 duration-300">Show daily forecast</button>
        </form>
      </div>
      <button className="rounded-md h-8 text-xl my-8 font-bold w-24 mx-auto border" onClick={handleSubmitNormal}>Go Back</button>
      <p className="flex mx-auto underline mb-7">Last Updated: {timeUpdatedHourConversion.toString().padStart(2, '0')}:{timeUpdated.timeUpdatedMinute} (<TimeZoneShow timeZone={props.timeZone} />)</p>
    </div>
  ));

  const AdvancedWeather = React.memo(() => (
    <div className="text-center flex-grow flex flex-col justify-center">
      <section className="mb-24 mt-7">
        <p className="mx-auto font-bold text-4xl underline">{props.dayConversion}</p>
        <p className="font-bold text-4xl mx-auto underline mt-5">{(props.hourConversion > 23 ? props.hourConversion - 24 : props.hourConversion < 0 ? props.hourConversion + 24 : props.hourConversion).toString().padStart(2, '0')}:{props.timeNormalMinutes} (<TimeZoneShow timeZone={props.timeZone} />)</p>
      </section>
      <section className="mb-4 mx-auto">
        <WeatherIcons 
          mainWeather={props.mainWeather} 
          windSpeed={props.windSpeed} 
          description={props.description} 
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
        <p>Precipitation: {props.precipitation}%</p>
        <p><WiBarometer size={30} className="inline mr-1" />Pressure: {props.pressure} hPa</p>
        <p>Visibility: {props.visibility >= 1000 ? `${props.visibility / 1000}km` : `${props.visibility}m`} (<VisibilityDesc visibility={props.visibility} />)</p>
      </section>
      <button className="rounded-md border h-8 text-xl my-8 font-bold w-24 mx-auto" onClick={handleSubmitAdvanced}>Go Back</button>
      <p className="flex mx-auto underline mb-7">Last Updated: {currentHourConversion?.toString().padStart(2, '0')}:{props.currentTime.minute} (<TimeZoneShow timeZone={props.timeZone} />)</p>
    </div>
  ));

  const ErrorDisplay = ({ message }) => (
    <div className="text-center bg-black min-h-screen flex flex-col justify-center">
      <p className="text-3xl uppercase font-bold">{message}</p>
      <a className="text-xl mt-8 underline uppercase font-bold hover:text-cyan-300 duration-300" href="/weather">Go Back</a>
    </div>
  );

  return (
    <div className="text-white bg-black flex flex-col min-h-screen">
      <Header />
      {props.loaded ? (
        props.mainWeather ? (
          props.choice === 'normal' ? <NormalWeather /> : <AdvancedWeather />
        ) : (
          <ErrorDisplay message={`The city you have entered ('${props.city}') has not been found`} />
        )
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
};