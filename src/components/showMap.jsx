import { MapContainer, TileLayer, Marker, Popup, ScaleControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, useMemo, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MenuBar } from '../components/menuBar';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useParams } from "react-router-dom";
import { WindSpeedLayer, TemperatureLayer, CloudLayer, RainViewerData, HybridLayer } from './layers';
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
        // Base styling for close button
        button.style.transition = 'all 0.2s ease';
        button.style.cursor = 'pointer';
        button.style.width = '20px';
        button.style.height = '20px';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.fontWeight = 'bold';
        button.style.right = '7px';
        button.style.top = '12px';
        
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
    const zoomContainer = document.querySelector('.leaflet-control-zoom');
    
    if (zoomInButton && zoomOutButton && zoomContainer) {
      // Apply styles to the container
      zoomContainer.style.border = 'none';
      zoomContainer.style.boxShadow = mapType === 'light' 
        ? '0 2px 10px rgba(0, 0, 0, 0.1)' 
        : '0 2px 10px rgba(0, 0, 0, 0.4)';
      zoomContainer.style.borderRadius = '8px';
      zoomContainer.style.overflow = 'hidden';
      
      // Common styles for both buttons
      [zoomInButton, zoomOutButton].forEach(button => {
        button.style.transition = 'all 0.2s ease';
        button.style.border = 'none';
        button.style.width = '36px';
        button.style.height = '36px';
        button.style.lineHeight = '36px';
        button.style.fontSize = '18px';
        button.style.fontWeight = 'bold';
        
        // Hover effect
        button.onmouseover = () => {
          if (mapType === 'light') {
            button.style.backgroundColor = '#f0f0f0';
          } else {
            button.style.backgroundColor = '#444';
          }
        };
        
        // Reset on mouseout
        button.onmouseout = () => {
          if (mapType === 'light') {
            button.style.backgroundColor = '#fff';
          } else {
            button.style.backgroundColor = '#333';
          }
        };
      });
      
      // Apply theme-specific styles
      if (mapType === 'light') {
        // Light mode styling
        zoomInButton.style.color = '#333';
        zoomInButton.style.backgroundColor = '#fff';
        zoomOutButton.style.color = '#333';
        zoomOutButton.style.backgroundColor = '#fff';
      } else {
        // Dark mode styling
        zoomInButton.style.color = '#f0f0f0';
        zoomInButton.style.backgroundColor = '#333';
        zoomOutButton.style.color = '#f0f0f0';
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
      // Apply common styles
      attributionElement.style.transition = 'all 0.2s ease';
      attributionElement.style.padding = '5px 8px';
      attributionElement.style.fontSize = '11px';
      attributionElement.style.lineHeight = '1.2';
      attributionElement.style.boxShadow = mapType === 'light' 
        ? '0 1px 5px rgba(0, 0, 0, 0.1)' 
        : '0 1px 5px rgba(0, 0, 0, 0.4)';
      attributionElement.style.whiteSpace = 'nowrap';
      attributionElement.style.overflow = 'hidden';
      attributionElement.style.textOverflow = 'ellipsis';
      attributionElement.style.maxWidth = 'calc(100vw - 20px)';
      
      // Add hover behavior to show full text
      attributionElement.onmouseover = () => {
        attributionElement.style.whiteSpace = 'normal';
        attributionElement.style.maxWidth = '300px';
        attributionElement.style.zIndex = '1000';
      };
      
      attributionElement.onmouseout = () => {
        attributionElement.style.whiteSpace = 'nowrap';
        attributionElement.style.overflow = 'hidden';
        attributionElement.style.textOverflow = 'ellipsis';
        attributionElement.style.maxWidth = 'calc(100vw - 20px)';
      };
      
      // Improve links styling
      const links = attributionElement.querySelectorAll('a');
      links.forEach(link => {
        link.style.textDecoration = 'none';
        link.style.fontWeight = '500';
        link.style.transition = 'color 0.2s ease';
        
        if (mapType === 'light') {
          link.style.color = '#0078A8';
        } else {
          link.style.color = '#6BB0FF';
        }
        
        // Add hover effect
        link.onmouseover = () => {
          if (mapType === 'light') {
            link.style.color = '#005580';
          } else {
            link.style.color = '#99CCFF';
          }
        };
        
        link.onmouseout = () => {
          if (mapType === 'light') {
            link.style.color = '#0078A8';
          } else {
            link.style.color = '#6BB0FF';
          }
        };
      });
      
      // Apply theme-specific styles
      if (mapType === 'light') {
        // Light mode
        attributionElement.style.color = '#333';
        attributionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        attributionElement.style.borderRadius = '8px 0 0 0';
      } else {
        // Dark mode
        attributionElement.style.color = '#e0e0e0';
        attributionElement.style.backgroundColor = 'rgba(40, 40, 40, 0.9)';
        attributionElement.style.borderRadius = '8px 0 0 0';
      }
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