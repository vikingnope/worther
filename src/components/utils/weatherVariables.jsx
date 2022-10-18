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
import { Header } from './header';
import { Footer } from './footer';

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

export const ShowWeather = (props) => {
  var times = {};

  (times = {
    sunriseHour: String((new Date(props.sunrise * 1000)).getHours()).padStart(2, '0'), // padStart makes sure we have 2 digits, if there is not it will add a 0 at the front
    sunriseMinute: String((new Date(props.sunrise * 1000)).getMinutes()).padStart(2, '0'),
    sunsetHour: String((new Date(props.sunset * 1000)).getHours()).padStart(2, '0'),
    sunsetMinute: String((new Date(props.sunset * 1000)).getMinutes()).padStart(2, '0'),
    timeUpdatedHour: String((new Date(props.timeUpdatedUNIX * 1000)).getHours()).padStart(2, '0'),
    timeUpdatedMinute: String((new Date(props.timeUpdatedUNIX * 1000)).getMinutes()).padStart(2, '0')
  });

  var sunriseHourConversion = (
    Math.round((((times.sunriseHour * 3600) + (new Date().getTimezoneOffset() * 60)) + props.timeZone) / 3600)
  );

  var sunsetHourConversion = (
    Math.round((((times.sunsetHour * 3600) + (new Date().getTimezoneOffset() * 60)) + props.timeZone) / 3600)
  );

  return(
    <div className="text-white">
      <Header choice={'showWeather'}/>
        {(props.loaded) ?
          ((props.mainWeather) ?
            ((props.choice === 'normal') ?
              <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
                <section className="mx-auto mb-4">
                  <WeatherIcons mainWeather={props.mainWeather} description={props.description} page={'single'}/>
                </section>
                <section className="text-lg">
                  <p className="underline text-3xl font-bold">{props.name}, {props.country}</p>
                  <p className="font-bold text-3xl mt-4">{props.description.toUpperCase()}</p>
                  <p className="mt-1">Temperature: {Math.round(props.temperature)}°C</p>
                  <p>Feels like: {Math.round(props.tempFeel)}°C</p>
                  <p>Max: {Math.round(props.tempMax)}°C &emsp; Min: {Math.round(props.tempMin)}°C</p>
                  <p>Humidity: {props.humidity}%</p>
                  <p>Wind Speed: {props.windSpeed} m/s &emsp; Wind Direction: {<WindDirection windDegrees={props.windDegrees}/>} @ {props.windDegrees}°</p>
                  <p>Pressure: {props.pressure} hPa</p>
                  <p>Visibility: {(props.visibility >= 1000) ?
                    (props.visibility / 1000) + 'km' :
                    (props.visibility) + 'm'} ({<VisibilityDesc visibility={props.visibility}/>})
                  </p>
                  <p>Sunrise: {(sunriseHourConversion > 23) ? String(sunriseHourConversion - 24).padStart(2, '0') : String(sunriseHourConversion).padStart(2, '0')}:{times.sunriseMinute} ({<TimeZoneShow timeZone={props.timeZone}/>}) &emsp; Sunset: {(sunsetHourConversion < 0) ? (sunsetHourConversion + 24) : sunsetHourConversion}:{times.sunsetMinute} ({<TimeZoneShow timeZone={props.timeZone}/>})</p>
                </section>
                <form onSubmit={props.handleSubmit}>
                  <button type='submit' className="text-lg underline mt-5 font-bold">Show 3 hour weather</button>
                </form>
                <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
                <p className="absolute -bottom-12 right-2.5 underline">Last Updated: {times.timeUpdatedHour}:{times.timeUpdatedMinute}</p>
              </div> 
            :
              <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
                <section className='mb-32'>
                  <p className='mt-5 mr-10 font-bold text-4xl underline inline-block'>Index: {parseInt(props.index) + 1}</p>
                  <p className='mt-5 mr-10 font-bold text-4xl underline inline-block'>{props.dayConversion}</p>
                  <p className='font-bold text-4xl mr-10 underline inline-block'>{(props.hourConversion > 23) ? String(props.hourConversion - 24).padStart(2, '0') : (props.hourConversion < 0) ? (props.hourConversion + 24) : String(props.hourConversion).padStart(2, '0')}:{props.timeNormalMinutes} ({<TimeZoneShow timeZone={props.timeZone}/>})</p>
                </section>
                  <section className="mb-4 mx-auto">
                    <WeatherIcons mainWeather={props.mainWeather} description={props.description} page={'single'}/>
                  </section>
                  <section className="text-lg">
                    <p className="underline text-3xl font-bold">{props.name}, {props.country}</p>
                    <p className="font-bold text-3xl mt-4">{props.description.toUpperCase()}</p>
                    <p className="mt-1">Temperature: {Math.round(props.temperature)}°C</p>
                    <p>Feels like: {Math.round(props.tempFeel)}°C</p>
                    <p>Max: {Math.round(props.tempMax)}°C &emsp; Min: {Math.round(props.tempMin)}°C</p>
                    <p>Humidity: {props.humidity}%</p>
                    <p>Wind Speed: {props.windSpeed} m/s &emsp; Wind Direction: {<WindDirection windDegrees={props.windDegrees}/>} @ {props.windDegrees}°</p>
                    <p>Pressure: {props.pressure} hPa</p>
                    <p>Visibility: {(props.visibility >= 1000) ?
                      (props.visibility / 1000) + 'km' :
                      (props.visibility) + 'm'} ({<VisibilityDesc visibility={props.visibility}/>})
                    </p>
                  </section>
                <a className="text-xl mt-8  underline uppercase font-bold" href="/weather">Go Back</a>
              </div>
            )
          :
            <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
              <p className="text-3xl uppercase font-bold">The city you have entered ('{props.city}') has not been found</p>
              <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
            </div>
          ) :
          (props.loaded === false && props.blocked === true) ?
          <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
            <p className="text-4xl uppercase font-bold">The API is currently blocked</p>
            <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
          </div> :
          (props.loaded === false && props.connectionError === true) ?
          <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
            <p className="text-4xl uppercase font-bold">Please check your internet connection</p>
            <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
          </div> :
          (props.loaded === false && !props.mainWeather) ?
            <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">
              <p className="text-3xl uppercase font-bold">The city you have entered ('{props.city}') has not been found</p>
              <a className="text-xl mt-8 underline uppercase font-bold" href="/weather">Go Back</a>
            </div>
          :
          <div className="text-center select-none bg-black min-h-screen flex flex-col justify-center">    
            <p className="font-bold text-2xl">Loading...</p>
          </div>
        }
      <Footer />
    </div>
  );
}