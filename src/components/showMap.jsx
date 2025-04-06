import { MapContainer, TileLayer, Marker, Popup, ScaleControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, useMemo, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MenuBar } from '../components/menuBar';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useParams } from "react-router-dom";
import { WindSpeedLayer, TemperatureLayer, CloudLayer, RainViewerData, HybridLayer } from './layers';
import { WeatherPopupContent } from './utils/weatherVariables';
import { CustomZoomControl, CustomAttributionControl, MapMode } from './utils/mapElements';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

// Custom component to style popup containers based on map mode
const CustomPopupStyle = ({ mapType }) => {
  const map = useMap();
  const isDesktop = useDeviceDetect();
  
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
        
        // If this is the popup content wrapper, enforce a consistent width
        // with smaller sizes for mobile devices
        if (element.classList.contains('leaflet-popup-content-wrapper')) {
          if (isDesktop) {
            // Desktop size
            element.style.minWidth = '280px';
            element.style.maxWidth = '320px';
          } else {
            // Mobile size - smaller width
            element.style.minWidth = '220px';
            element.style.maxWidth = '260px';
          }
          element.style.width = 'auto';
        }
      });
      
      // Ensure popup content also maintains width
      const popupContent = document.querySelectorAll('.leaflet-popup-content');
      popupContent.forEach(content => {
        content.style.width = '100%';
        // Adjust margins on mobile
        content.style.margin = isDesktop ? '8px 12px' : '6px 8px';
        // Add smaller font size on mobile
        if (!isDesktop) {
          content.style.fontSize = '0.9rem';
        }
      });
      
      // Style the close button
      const closeButtons = document.querySelectorAll('.leaflet-popup-close-button');
      closeButtons.forEach(button => {
        // Base styling for close button
        button.style.transition = 'all 0.2s ease';
        button.style.cursor = 'pointer';
        button.style.width = isDesktop ? '20px' : '18px';
        button.style.height = isDesktop ? '20px' : '18px';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.fontWeight = 'bold';
        button.style.right = isDesktop ? '7px' : '5px';
        button.style.top = isDesktop ? '12px' : '8px';
        button.style.fontSize = isDesktop ? '16px' : '14px';
        
        if (mapType === 'light') {
          button.style.color = '#000000';
        } else {
          button.style.color = '#ffffff';
        }
        
        // Add hover effects to make the X itself animate
        button.onmouseover = () => {
          button.style.transform = 'scale(1.2)';
          // Use a darker shade of the current color instead of blue
          button.style.color = mapType === 'light' 
            ? '#333333' // Darker shade for light mode
            : '#aaaaaa'; // Darker shade for dark mode
          button.style.fontWeight = 'bolder';
        };
        
        button.onmouseout = () => {
          button.style.transform = 'scale(1)';
          button.style.color = mapType === 'light' ? '#000000' : '#ffffff';
          button.style.fontWeight = 'bold';
        };
      });
    }
    
    return () => {
      map.off('popupopen', stylePopups);
    };
  }, [mapType, map, isDesktop]);
  
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

    const markerIconConst = useMemo(() => L.divIcon({
      className: '',
      html: `
        <div class="relative">
          <div class="absolute w-8 h-8 bg-blue-300 bg-opacity-15 rounded-full animate-pulse"></div>
          <div class="absolute w-6 h-6 bg-blue-300 bg-opacity-25 rounded-full top-1 left-1"></div>
          <div class="absolute w-3 h-3 bg-blue-500 rounded-full top-2.5 left-2.5 shadow-md"></div>
        </div>
      `,
      iconAnchor: [16, 16], // Center of the marker
      popupAnchor: [0, -16], // Above the marker
      iconSize: [32, 32]
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
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url={(mapType === 'light') ?
                            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" :
                            "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                        }
                        subdomains={(mapType === 'light') ? "abcd" : "abcd"}
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