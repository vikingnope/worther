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

export const HybridLayer = (props) => {
  // Define the labelLayerProps here, outside of JSX
  const labelLayerProps = {
    url: (props.mapType === 'light') 
      ? "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" 
      : "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    tileSize: 256,
    zIndex: 3,
    opacity: 1,
    className: "labels-layer",
    subdomains: "abcd"
  };
  
  return (
    <>
    {
      (props.show) ?
        <>
          {/* Base satellite layer */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics'
            tileSize={256}
            zIndex={2}
            opacity={1}
          />
          {/* Labels overlay layer */}
          <TileLayer
            url={labelLayerProps.url}
            attribution={labelLayerProps.attribution}
            tileSize={labelLayerProps.tileSize}
            zIndex={labelLayerProps.zIndex}
            opacity={labelLayerProps.opacity}
            className={labelLayerProps.className}
            subdomains={labelLayerProps.subdomains}
          />
        </> : <></>
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
          url = {`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`}
          tileSize={256}
          zIndex = {2}
          opacity = {props.opacity}
        /> : <></>
    }
    </>
  )
  
}
