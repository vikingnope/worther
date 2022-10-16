import { BsFillSunFill } from 'react-icons/bs'; // sunny
import { AiFillCloud } from 'react-icons/ai'; // cloudy
import { BsFillCloudRainHeavyFill } from 'react-icons/bs'; // heavy intensity rain
import { BsFillCloudDrizzleFill } from 'react-icons/bs' // drizzle
import { BsFillCloudLightningRainFill } from 'react-icons/bs'; // thunder and rain
import { BsFillCloudSnowFill } from 'react-icons/bs'; // snow
import { BsCloudFog } from 'react-icons/bs'; // fog
import { BsFillCloudRainFill } from 'react-icons/bs'; // light rain
import { BsFillCloudsFill } from 'react-icons/bs'; // overcast clouds
import { BsFillCloudSunFill } from 'react-icons/bs'; // scattered clouds
import { BsFillCloudHazeFill } from 'react-icons/bs'; // haze
import { TbMist } from 'react-icons/tb'; // mist

export const WeatherIcons = (props) => {
  var size = '';

  ((props.page === 'single') ?
    size = '200' :
    size = '50'
  );

  return (
    (props.mainWeather === "Clear") ?
      <BsFillSunFill size={size} color={'white'} /> :
    (props.description === "scattered clouds" || props.description === "broken clouds") ?
      <BsFillCloudSunFill size={size} color={'white'} className="mb-0" /> :
    (props.description === "few clouds") ?
      <AiFillCloud size={size} color={'white'} className="mb-0" /> :
    (props.description === "overcast clouds") ?
      <BsFillCloudsFill size={size} color={'white'} className="mb-0" /> :
    (props.description === "light rain") ?
      <BsFillCloudRainFill size={size} color={'white'} /> :
    (props.description === "heavy intensity rain" || props.description === "moderate rain") ?
      <BsFillCloudRainHeavyFill size={size} color={'white'} /> :
    (props.mainWeather === "Drizzle") ?
      <BsFillCloudDrizzleFill size={size} color={'white'} /> :
    (props.description === "thunderstorm with light rain") ?
      <BsFillCloudLightningRainFill  size={size} color={'white'} className="mb-0" /> :
    (props.mainWeather === "Fog") ?
      <BsCloudFog size={size} color={'white'} /> :
    (props.mainWeather === "Snow") ?
      <BsFillCloudSnowFill size={size} color={'white'} /> :
    (props.description === "haze") ?
      <BsFillCloudHazeFill size={size} color={'white'} /> :
    (props.description === "mist") ?
      <TbMist size={size} color={'white'} /> :
    <> </>
  );
}

export const TimeZoneShow = (props) => {
    var timeZoneShown = '';
    
    ((props.timeZone === 0) ?
      timeZoneShown = 'GMT' :
    (props.timeZone === -3600) ?
      timeZoneShown = 'GMT-1' :
    (props.timeZone === -7200) ?
      timeZoneShown = 'GMT-2' :
    (props.timeZone === -10800) ?
      timeZoneShown = 'GMT-3' :
    (props.timeZone === -14400) ?
      timeZoneShown = 'GMT-4' :
    (props.timeZone === -18000) ?
      timeZoneShown = 'GMT-5' :
    (props.timeZone === -21600) ?
      timeZoneShown = 'GMT-6' :
    (props.timeZone === -25200) ?
      timeZoneShown = 'GMT-7' :
    (props.timeZone === -28800) ?
      timeZoneShown = 'GMT-8' :
    (props.timeZone === -32400) ?
      timeZoneShown = 'GMT-9' :
    (props.timeZone === -36000) ?
      timeZoneShown = 'GMT-10' :
    (props.timeZone === -39600) ?
      timeZoneShown = 'GMT-11' :
    (props.timeZone === -43200) ?
      timeZoneShown = 'GMT-12' :
    (props.timeZone === 3600) ?
      timeZoneShown = 'GMT+1' :
    (props.timeZone === 7200) ?
      timeZoneShown = 'GMT+2' :
    (props.timeZone === 10800) ?
      timeZoneShown = 'GMT+3' :
    (props.timeZone === 14400) ?
      timeZoneShown = 'GMT+4' :
    (props.timeZone === 18000) ?
      timeZoneShown = 'GMT+5' :
    (props.timeZone === 19800) ?
      timeZoneShown = 'GMT+5:30' :
    (props.timeZone === 21600) ?
      timeZoneShown = 'GMT+6' :
    (props.timeZone === 25200) ?
      timeZoneShown = 'GMT+7' :
    (props.timeZone === 28800) ?
      timeZoneShown = 'GMT+8' :
    (props.timeZone === 32400) ?
      timeZoneShown = 'GMT+9' :
    (props.timeZone === 36000) ?
      timeZoneShown = 'GMT+10' :
    (props.timeZone === 39600) ?
      timeZoneShown = 'GMT+11' :   
    (props.timeZone === 43200) ?
      timeZoneShown = 'GMT+12' :
    (props.timeZone === 46800) ?
      timeZoneShown = 'GMT+13' : 
    (props.timeZone === 50400) ?
      timeZoneShown = 'GMT+14' :                 
    <></> 
    );

    return(
        timeZoneShown
    );
}

export const VisibilityDesc = (props) => {
  var visibilityDescription = '';

  ((props.visibility < 50) ?
  visibilityDescription = 'Dense Fog' :
  (props.visibility >= 50 && props.visibility < 200) ?
    visibilityDescription = 'Thick Fog' :
  (props.visibility >= 200 && props.visibility < 500) ?
    visibilityDescription = 'Moderate Fog' :
  (props.visibility >= 500 && props.visibility < 1000) ?
    visibilityDescription = 'Light Fog' :
  (props.visibility >= 1000 && props.visibility < 2000) ?
    visibilityDescription = 'Thin Fog' :
  (props.visibility >= 2000 && props.visibility < 4000) ?
    visibilityDescription = 'Haze' :
  (props.visibility >= 4000 && props.visibility < 10000) ?
    visibilityDescription = 'Light Haze' :
  (props.visibility === 10000) ?
    visibilityDescription = 'Clear' :
    <></>
  );

  return (
    visibilityDescription
  );
}


export const WindDirection = (props) => {
  var windDirection = '';

  (((props.windDegrees >= 0 && props.windDegrees <= 11.25) || (props.windDegrees  > 348.75)) ? 
          windDirection = 'N'  : 
        (props.windDegrees >= 11.26 && props.windDegrees < 33.75) ?
          windDirection = 'NNE' :
        (props.windDegrees >= 33.75 && props.windDegrees < 56.25) ?
          windDirection = 'NE' :
        (props.windDegrees >= 56.25 && props.windDegrees < 78.75) ?
          windDirection = 'ENE' :
        (props.windDegrees >= 78.75 && props.windDegrees < 101.25) ?
          windDirection = 'E' :
        (props.windDegrees >= 101.25 && props.windDegrees < 123.75) ?
          windDirection = 'ESE' :
        (props.windDegrees >= 123.75 && props.windDegrees < 146.25) ?
          windDirection = 'SE' :
        (props.windDegrees >= 146.25 && props.windDegrees < 168.75) ?
          windDirection = 'SSE' :
        (props.windDegrees >= 168.75 && props.windDegrees < 191.25) ?
          windDirection = 'S' : 
        (props.windDegrees >= 191.25 && props.windDegrees < 213.75) ?
          windDirection = 'SSW' :
        (props.windDegrees >= 213.75 && props.windDegrees < 236.25) ?
          windDirection = 'SW' :
        (props.windDegrees >= 236.25 && props.windDegrees < 258.75) ?
          windDirection = 'WSW' :
        (props.windDegrees >= 258.75 && props.windDegrees < 281.25) ?
          windDirection = 'W' :
        (props.windDegrees >= 281.25 && props.windDegrees < 303.75) ?
          windDirection = 'WNW' :
        (props.windDegrees >= 303.75 && props.windDegrees < 326.25) ?
          windDirection = 'NW' :
        (props.windDegrees >= 326.25 && props.windDegrees < 348.75) ?
          windDirection = 'NNW' :                          
        <> </>
  );

  return (
    windDirection
  );
}