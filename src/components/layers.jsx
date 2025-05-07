import Terminator from '@joergdietrich/leaflet.terminator';
import axios from 'axios';
import { useEffect, useState, memo, useRef } from 'react';
import { TileLayer, useMap } from 'react-leaflet';

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
export const DayNightLayer = memo(props => {
  const map = useMap();
  const terminatorRef = useRef(null);
  const intervalRef = useRef(null);

  // Effect for creating/destroying the layer based only on props.show
  useEffect(() => {
    // If show is true and terminator doesn't exist, create it
    if (props.show && !terminatorRef.current) {
      try {
        // Create the terminator and add it to the map using the imported Terminator module
        terminatorRef.current = new Terminator({
          color: props.mapType === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          fillColor: props.mapType === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(50, 50, 50, 0.5)',
          fillOpacity: props.opacity || 0.5,
          weight: 2, // Add a thicker line weight for better visibility
        }).addTo(map);

        // Ensure the terminator is in the correct position on first render
        terminatorRef.current.setTime();

        // Update the terminator position every minute (60000ms)
        intervalRef.current = window.setInterval(() => {
          if (terminatorRef.current) {
            terminatorRef.current.setTime();
          }
        }, 60000);
      } catch (error) {
        console.error('Failed to create day/night terminator:', error);
        terminatorRef.current = null;
      }
    }
    // If show is false and terminator exists, remove it
    else if (!props.show && terminatorRef.current) {
      map.removeLayer(terminatorRef.current);
      terminatorRef.current = null;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Clean up function for useEffect
    return () => {
      if (terminatorRef.current) {
        map.removeLayer(terminatorRef.current);
        terminatorRef.current = null;
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [map, props.show]); // Only depend on map and props.show

  // Separate effect for opacity updates
  useEffect(() => {
    if (props.show && terminatorRef.current && props.opacity !== undefined) {
      terminatorRef.current.setStyle({
        fillOpacity: props.opacity,
        opacity: props.opacity,
      });
    }
  }, [props.opacity, props.show]);

  // Separate effect for map type (color) updates
  useEffect(() => {
    if (props.show && terminatorRef.current && props.mapType) {
      terminatorRef.current.setStyle({
        color: props.mapType === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        fillColor: props.mapType === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.5)',
      });
    }
  }, [props.mapType, props.show]);

  // This component doesn't render anything visible directly
  return null;
});

DayNightLayer.displayName = 'DayNightLayer';

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
