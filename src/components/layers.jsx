import axios from "axios";
import { TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from "react"

export const CloudLayer = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
        url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=45245b26fa062bdd9ca60efac28d1c01`}
        tileSize={256}
        zIndex = {3}
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
        url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=45245b26fa062bdd9ca60efac28d1c01`}
        tileSize={256}
        zIndex = {3}
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
        url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=45245b26fa062bdd9ca60efac28d1c01`}
        tileSize={256}
        zIndex = {3}
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
            opacity = {props.opacity} /> : <></>
      }
    </>
  )
}

export const SatelliteData = () => {
    const [Bbox, setBbox] = useState();
    const [size, setSize] = useState();

    const map = useMap()

    useEffect(() => {
        setBbox(map.getBounds().toBBoxString());
        setSize(map.getSize());
    }, [map]);

    return (
        <>
            {
                (Bbox !== undefined && size !== undefined) ?
                    <TileLayer 
                    zIndex={2} 
                    opacity={0.1}
                    tileSize={size}
                    url={`https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=${size.y}&width=${size.x}&crs=EPSG:4326&format=image/jpeg&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=${Bbox}`}
                    /> : <> </>
            }   
        </>
    )
};
