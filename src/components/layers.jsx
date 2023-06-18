import axios from "axios";
import { TileLayer } from 'react-leaflet';
import { useEffect, useState } from "react"

export const CloudLayer = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
        url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`}
        tileSize={256}
        zIndex = {3}
        maxZoom={16}
        opacity = {props.opacity} 
        /> :
        <></>
    }   
    </>
  )
};

export const WindSpeedLayer = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
        url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`}
        tileSize={256}
        zIndex = {3}
        maxZoom={16}
        opacity = {props.opacity} 
        /> :
        <></>
    }
    </>
  )
};

export const TemperatureLayer = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
        url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`}
        tileSize={256}
        zIndex = {3}
        maxZoom={16}
        opacity = {props.opacity} 
        /> :
        <></>
    }  
    </>
  )
};

const baseURL = 'https://api.rainviewer.com/public/weather-maps.json';

export const RainViewerData = (props) => {
  const [path, setPath] = useState();

  useEffect(() => {
    getPath();
  }, []);

  async function getPath(){
    await axios.get(baseURL)
      .then(response => {
        const lastPath = response.data.radar.past.length-1;
        setPath(response.data.radar.past[lastPath].path);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <>
      {
        (path !== undefined && props.show) ?
          <TileLayer
            url={`https://tilecache.rainviewer.com${path}/256/{z}/{x}/{y}/2/1_1.png`}
            tileSize={256}
            zIndex = {3}
            maxZoom={16}
            opacity = {props.opacity} /> : <></>
      }
    </>
  )
}

export const SatelliteDataEsri = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
          url = {`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`}
          tileSize={256}
          zIndex = {2}
          opacity = {props.opacity}
        /> : <></>
    }
  </>
  )
  
}

export const WindDirectionLayer = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
          // {...(
          //   axios.get(`https://api.stormglass.io/v2/weather/point?lat={y}&lng={x}`)
          //   .then(response => {
          //     console.log(response);
          //   })
          //   .catch(error => {
          //     console.log(error);
          //   })
          // )}
          url = {`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`}
          tileSize={256}
          zIndex = {2}
          opacity = {props.opacity}
        /> : <></>
    }
  </>
  )
  
}
