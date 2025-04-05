import { MapContainer, TileLayer, Marker, Popup, ScaleControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, useMemo, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MenuBar } from '../components/menuBar';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useParams } from "react-router-dom";
import { WindSpeedLayer, TemperatureLayer, CloudLayer, RainViewerData, HybridLayer } from './layers';
import markerDot from "../resources/location-dot.png";
import { MapMode } from './utils/mapMode';
import { WeatherPopupContent } from './utils/weatherVariables';

// Custom component to style popup containers based on map mode
const CustomPopupStyle = ({ mapType }) => {
  const map = useMap();
  
  useEffect(() => {
    // Apply initial styling to any existing popups
    stylePopups();
    
    // Add event listener to style popups when they're created
    map.on('popupopen', stylePopups);
    
    function stylePopups() {
      // Find all popup containers and style them
      const popupContainers = document.querySelectorAll('.leaflet-popup-content-wrapper, .leaflet-popup-tip');
      
      popupContainers.forEach(element => {
        if (mapType === 'light') {
          // Light mode - default is already white
          element.style.backgroundColor = '#ffffff';
          element.style.color = '#000000';
        } else {
          // Dark mode
          element.style.backgroundColor = '#1a1a1a';
          element.style.color = '#ffffff';
        }
      });
      
      // Style the close button
      const closeButtons = document.querySelectorAll('.leaflet-popup-close-button');
      closeButtons.forEach(button => {
        if (mapType === 'light') {
          button.style.color = '#000000';
        } else {
          button.style.color = '#ffffff';
        }
      });
    }
    
    return () => {
      map.off('popupopen', stylePopups);
    };
  }, [mapType, map]);
  
  return null; // This component doesn't render anything, just applies styling
};

// Custom component to style zoom control based on map mode
const CustomZoomControl = ({ mapType }) => {
  const map = useMap();
  
  useEffect(() => {
    // Find all zoom control elements and style them according to map type
    const zoomInButton = document.querySelector('.leaflet-control-zoom-in');
    const zoomOutButton = document.querySelector('.leaflet-control-zoom-out');
    
    if (zoomInButton && zoomOutButton) {
        if (mapType === 'light') {
        // Light mode - dark buttons/light background
        zoomInButton.style.color = 'black';
        zoomInButton.style.backgroundColor = '#fff';
        zoomOutButton.style.color = 'black';
        zoomOutButton.style.backgroundColor = '#fff';
        } else {
        // Dark mode - light buttons/dark background
        zoomInButton.style.color = 'white';
        zoomInButton.style.backgroundColor = '#333';
        zoomOutButton.style.color = 'white';
        zoomOutButton.style.backgroundColor = '#333';
        }
    }
  }, [mapType, map]);
  
  return null; // This component doesn't render anything, just applies styling
};

// Custom component to style attribution control based on map mode
const CustomAttributionControl = ({ mapType }) => {
  const map = useMap();
  
  useEffect(() => {
    // Find attribution control element and style according to map type
    const attributionElement = document.querySelector('.leaflet-control-attribution');
    
    if (attributionElement) {
      if (mapType === 'light') {
        // Light mode
        attributionElement.style.color = 'black';
        attributionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      } else {
        // Dark mode
        attributionElement.style.color = 'white';
        attributionElement.style.backgroundColor = 'rgba(60, 60, 60, 0.8)';
      }
      
      // Add rounded corner only to the top-left
      attributionElement.style.borderTopLeftRadius = '4px';
    }
  }, [mapType, map]);
  
  return null; // This component doesn't render anything, just applies styling
};

// Custom component to dynamically update map background color
const MapBackgroundUpdater = ({ mapType }) => {
    const map = useMap();

    useEffect(() => {
        if (map) {
        // Get the map container element and update its background color
        const container = map.getContainer();
        if (container) {
            container.style.backgroundColor = mapType === 'light' ? '#ffffff' : '#121212';
        }
        }
    }, [mapType, map]);

    return null; // This component doesn't render anything, just applies styling
};

export default function ShowMap(props) {   
    const [ userPos, setUserPos ] = useState({latitude: undefined, longitude: undefined});
    const [ layerOpacity, setLayerOpacity ] = useState(props.layerOpacity || 0.7);
    const [ cloudLayerChoice, setCloudLayerChoice ] = useState(false);
    const [ temperatureLayerChoice, setTemperatureLayerChoice ] = useState(false);
    const [ windLayerChoice, setWindLayerChoice ] = useState(false);
    const [ rainLayerChoice, setRainLayerChoice ] = useState(true);
    const [ satelliteLayerChoice, setSatelliteLayerChoice ] = useState(false);
    const [ windDirChoice, setWindDirChoice ] = useState(false);

    const { mapType } = useParams();

    document.title = "Worther - Map";

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos) =>{
                const newUserPos = { 
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                 };
                setUserPos(newUserPos);
           })
        }  
    }, []);

    const markerIconConst = useMemo(() => L.icon({
        iconUrl: markerDot,
        iconRetinaUrl: markerDot,
        iconAnchor: [13, 14],
        popupAnchor: [0, -13],
        iconSize: [26.5, 28]
    }), []);

    const map = useCallback((markerShow, zoomLevel) => {
        return( 
            <div className="text-white flex flex-col min-h-screen overflow-hidden bg-black">
                <Header/>
                <MapContainer center={(userPos.latitude && userPos.longitude) ? [userPos.latitude, userPos.longitude] : [45, 10]} zoom={zoomLevel} minZoom={2} maxBounds={[[-180, -180], [180, 180]]} maxBoundsViscosity={0.75} doubleClickZoom={false} className='grow'>
                    <ScaleControl position="bottomleft" />
                    <CustomZoomControl mapType={mapType} />
                    <CustomAttributionControl mapType={mapType} />
                    <CustomPopupStyle mapType={mapType} />
                    <TileLayer 
                        zIndex={1}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={(mapType === 'light') ?
                            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :
                            "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                        }
                        subdomains={(mapType === 'light') ? "abc" : "abcd"}
                    />
                    <RainViewerData show={rainLayerChoice} opacity={layerOpacity} />
                    <WindSpeedLayer show={windLayerChoice} opacity={layerOpacity}/>
                    <TemperatureLayer show={temperatureLayerChoice} opacity={layerOpacity}/>
                    <CloudLayer show={cloudLayerChoice} opacity={layerOpacity}/>
                    <HybridLayer show={satelliteLayerChoice} mapType={mapType}/>
                    <MapBackgroundUpdater mapType={mapType} />
                    {/* <WindDirectionLayer show={windDirChoice} opacity={layerOpacity} /> */}
                    <MenuBar mode={mapType} showWindDir={windDirChoice} onShowWindDirChange={setWindDirChoice} showSatellite={satelliteLayerChoice} onShowSatelliteChange={setSatelliteLayerChoice} showRain={rainLayerChoice} onShowRainChange={setRainLayerChoice} showCloud={cloudLayerChoice} onShowCloudChange={setCloudLayerChoice} showWind={windLayerChoice} onShowWindChange={setWindLayerChoice} showTemperature={temperatureLayerChoice} onShowTemperatureChange={setTemperatureLayerChoice} layerOpacity={layerOpacity} onLayerOpacityChange={setLayerOpacity}/>
                    {(!markerShow) ? (
                        <Marker icon={markerIconConst} position={[userPos.latitude, userPos.longitude]}>
                            <Popup>
                                <WeatherPopupContent 
                                    userPos={userPos}
                                    color={mapType === 'light' ? 'black' : 'white'}
                                    mapType={mapType}
                                    page={'map'}
                                />
                            </Popup> 
                        </Marker>
                    ) : (
                        <></>
                    )}
                    <MapMode mode={mapType}/>
                </MapContainer>
                <Footer/>
            </div>
        )
    }, [userPos, mapType, rainLayerChoice, windLayerChoice, temperatureLayerChoice, cloudLayerChoice, satelliteLayerChoice, windDirChoice, layerOpacity, markerIconConst]);

    return(
        <div>
            {
                (userPos.latitude && userPos.longitude) ? 
                 map(false, 6) : map(true, 3)
            }
        </div>
    );
}