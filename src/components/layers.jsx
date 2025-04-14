import axios from 'axios';
import { TileLayer } from 'react-leaflet';
import { useEffect, useState, memo } from 'react';

export const CloudLayer = memo(props => {
  return (
    <>
      {props.show ? (
        <TileLayer
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`}
          tileSize={256}
          zIndex={3}
          maxZoom={16}
          opacity={props.opacity}
        />
      ) : null}
    </>
  );
});

CloudLayer.displayName = 'CloudLayer';

export const WindSpeedLayer = memo(props => {
  return (
    <>
      {props.show ? (
        <TileLayer
          url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`}
          tileSize={256}
          zIndex={3}
          maxZoom={16}
          opacity={props.opacity}
        />
      ) : null}
    </>
  );
});

WindSpeedLayer.displayName = 'WindSpeedLayer';

export const TemperatureLayer = memo(props => {
  return (
    <>
      {props.show ? (
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`}
          tileSize={256}
          zIndex={3}
          maxZoom={16}
          opacity={props.opacity}
        />
      ) : null}
    </>
  );
});

TemperatureLayer.displayName = 'TemperatureLayer';

const baseURL = 'https://api.rainviewer.com/public/weather-maps.json';

export const RainViewerData = memo(props => {
  const [path, setPath] = useState();

  useEffect(() => {
    getPath();
  }, []);

  async function getPath() {
    try {
      const response = await axios.get(baseURL);
      const lastPath = response.data?.radar?.past?.length - 1;
      if (lastPath >= 0) {
        setPath(response.data.radar.past[lastPath].path);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {path !== undefined && props.show ? (
        <TileLayer
          url={`https://tilecache.rainviewer.com${path}/256/{z}/{x}/{y}/2/1_1.png`}
          tileSize={256}
          zIndex={3}
          maxZoom={16}
          opacity={props.opacity}
        />
      ) : (
        <></>
      )}
    </>
  );
});

RainViewerData.displayName = 'RainViewerData';

// Define the labelLayerProps here, outside of JSX
const getLabelLayerProps = mapType => ({
  url:
    mapType === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
  tileSize: 256,
  zIndex: 3,
  opacity: 1,
  className: 'labels-layer',
  subdomains: 'abcd',
});

export const HybridLayer = memo(props => {
  const labelLayerProps = getLabelLayerProps(props.mapType);

  return (
    <>
      {props.show ? (
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
          <TileLayer {...labelLayerProps} />
        </>
      ) : null}
    </>
  );
});

HybridLayer.displayName = 'HybridLayer';

// export const WindDirectionLayer = (props) => {

//   return (
//     <>
//     {
//       (props.show) ?
//         <TileLayer
//           url = {`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`}
//           tileSize={256}
//           zIndex = {2}
//           opacity = {props.opacity}
//         /> : <></>
//     }
//     </>
//   )

// }
