import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { usePapaParse } from 'react-papaparse';
import L from 'leaflet';
import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import beaches from "../resources/beaches.csv";
import { useDeviceDetect } from "../hooks/useDeviceDetect";
import 'leaflet/dist/leaflet.css';
import { FaArrowLeft, FaRegEye } from "react-icons/fa6";
import { TiWarningOutline } from "react-icons/ti";
import { LiaLocationArrowSolid } from "react-icons/lia";
import { WindDirection } from "../components/utils/weatherVariables";

// Component to control zoom based on device detection
function ZoomController({ isDesktop }) {
  const map = useMap();

  useEffect(() => {
    document.title = "Worther - Beach Recommendations";
  }, []);
  
  useEffect(() => {
    const currentZoom = map.getZoom();
    
    // Only adjust zoom if we're at minimum zoom (10) for desktop
    // or if we're at the desktop zoom (11) for mobile
    if ((currentZoom === 10 && isDesktop) || (currentZoom === 11 && !isDesktop)) {
      map.setZoom(isDesktop ? 11 : 10);
    }
  }, [isDesktop, map]);
  
  return null;
}

// Component to focus map on a specific location
function MapFocuser({ focusLocation, resetFocus, isDesktop }) {
  const map = useMap();
  
  useEffect(() => {
    if (focusLocation) {
      // Use a smaller zoom level on mobile for better visibility
      const zoomLevel = isDesktop ? 14 : 13;
      
      // Add a slight delay to ensure map is ready
      const timer = setTimeout(() => {
        map.setView([focusLocation.lat, focusLocation.lon], zoomLevel, {
          animate: true,
          pan: {
            duration: 1
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusLocation, map, isDesktop]);

  useEffect(() => {
    if (resetFocus) {
      // Set different default views based on device
      const defaultZoom = isDesktop ? 11 : 10;
      map.setView([35.940125, 14.374125], defaultZoom, {
        animate: true
      });
    }
  }, [resetFocus, map, isDesktop]);
  
  return null;
}

// Add a new component to track map state
function MapStateTracker({ isDesktop, setIsMapModified }) {
  const map = useMap();
  const defaultCenter = [35.940125, 14.374125];
  const defaultZoom = isDesktop ? 11 : 10;
  const initialStateRef = useRef(true); // Reference to track initial state
  
  // Check if the map is in its default state
  const checkMapState = () => {
    if (!map) return;
    
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    
    // Allow for small differences in center position (rounding errors)
    const centerDiff = Math.abs(currentCenter.lat - defaultCenter[0]) + 
                       Math.abs(currentCenter.lng - defaultCenter[1]);
    
    // Map is in default state if zoom is default (exact match) and center is approximately default
    // Using a more generous tolerance for center position for laptops especially
    const isDefault = (currentZoom === defaultZoom && centerDiff < 0.1);
    
    // Update state only if there's a change
    setIsMapModified(!isDefault);
    
    // Reset initial state marker once we've confirmed the map has moved from default
    if (!isDefault && initialStateRef.current) {
      initialStateRef.current = false;
    }
  };
  
  // Force reset map modified state when resetMapView is called
  const forceResetMapState = () => {
    // Set a small delay to ensure the map animation has completed
    setTimeout(() => {
      setIsMapModified(false);
      initialStateRef.current = true;
      
      // Dispatch custom event to notify Leaflet that reset is complete
      if (map) {
        map.fire('resetComplete');
      }
    }, 500); // Increased delay for more reliable reset
  };
  
  useEffect(() => {
    if (!map) return;
    
    // Add a slight delay for initial check after map is fully initialized
    const timer = setTimeout(() => {
      checkMapState();
    }, 300);
    
    // Add event listeners for map movements
    map.on('zoomend', checkMapState);
    map.on('moveend', checkMapState);
    map.on('load', checkMapState);
    
    // Custom event for reset button click
    map.on('resetView', forceResetMapState);
    
    return () => {
      clearTimeout(timer);
      map.off('zoomend', checkMapState);
      map.off('moveend', checkMapState);
      map.off('load', checkMapState);
      map.off('resetView', forceResetMapState);
      map.off('resetComplete'); // Clean up this listener too
    };
  }, [map, defaultZoom]);
  
  // Reset check when defaultZoom changes (device type changes)
  useEffect(() => {
    checkMapState();
  }, [defaultZoom, isDesktop]);
  
  return null;
}

export default function Recommendations () {
  const { readString } = usePapaParse();
  const [ data, setData ] = useState([]);
  const [ wind, setWind ] = useState([]);
  const [ suitability, setSuitability ] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useDeviceDetect(1280); // 1280px (xl) is the breakpoint for desktop (i.e. md size in tailwindcss)
  
  // State for focused beach location
  const [focusLocation, setFocusLocation] = useState(null);
  const [resetFocus, setResetFocus] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState(null); // Track selected beach
  const [isMapModified, setIsMapModified] = useState(false); // Track if map is in modified state
  const [buttonVisible, setButtonVisible] = useState(false); // Track button visibility for animation
  const mapRef = useRef(null);
  const mapSectionRef = useRef(null); // Ref for the map section to scroll to

  // Add this function to handle map clicks
  const handleMapClick = () => {
    if (selectedBeach) {
      setSelectedBeach(null);
      setFocusLocation(null);
    }
  };
  
  // Function to reset map view
  const resetMapView = () => {
    // Close any open popups
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
    
    setSelectedBeach(null);
    setFocusLocation(null);
    setResetFocus(true);
    
    // Fire the custom event to ensure MapStateTracker knows about the reset
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current._leaflet_id && mapRef.current.fire('resetView');
      }, 100);
    }
    
    setTimeout(() => setResetFocus(false), 100);
  };

// Create CSS classes for our markers
  useEffect(() => {
    // This effect was previously used for CSS pulse animation
    // The CSS has been moved to main.css file for better separation of concerns
    document.title = "Worther - Beach Recommendations";
  }, []);

  // Helper function to create marker icon HTML with direct color values
  const createMarkerIconHtml = (bgColor, gradientFrom, gradientTo, borderColor, size, glowOpacity, blurSize) => {
    const dotSize = size * 0.36; // Calculate inner dot size proportionally
    const pixelSize = size * 5; // Base pixel size for the marker
    const dotPixelSize = dotSize * 5; // Pixel size for the white dot
    
    // Direct color mapping
    const colorMap = {
      'blue-300': '#93c5fd',
      'blue-400': '#60a5fa',
      'blue-500': '#3b82f6',
      'blue-600': '#2563eb',
      'blue-200': '#bfdbfe',
      'red-300': '#fca5a5',
      'red-400': '#f87171',
      'red-500': '#ef4444',
      'red-600': '#dc2626',
      'red-200': '#fecaca'
    };
    
    return `
      <div style="position: relative; width: ${pixelSize}px; height: ${pixelSize}px;">
        <div style="position: absolute; inset: 0; background-color: ${colorMap[bgColor]}; opacity: 0.${glowOpacity}; border-radius: 50%; filter: blur(${blurSize === 'sm' ? '4px' : '8px'});"></div>
        <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(to bottom right, ${colorMap[gradientFrom]}, ${colorMap[gradientTo]}); border-radius: 50%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid ${colorMap[borderColor]}; display: flex; align-items: center; justify-content: center; ${size > 4 ? 'animation: pulse-animation 1.5s infinite;' : ''}">
          <div style="width: ${dotPixelSize}px; height: ${dotPixelSize}px; border-radius: 50%; background-color: white; opacity: ${size > 4 ? '0.9' : '0.8'};"></div>
        </div>
      </div>
    `;
  };

  const markerIcons = useMemo(() => ({
    recommended: L.divIcon({
      className: '',
      html: createMarkerIconHtml('blue-400', 'blue-300', 'blue-500', 'blue-200', 3.5, '50', 'sm'),
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    }),
    unsuitable: L.divIcon({
      className: '',
      html: createMarkerIconHtml('red-500', 'red-400', 'red-600', 'red-300', 3.5, '50', 'sm'),
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    }),
    // Add larger versions of the icons for the selected beach
    selectedRecommended: L.divIcon({
      className: '',
      html: createMarkerIconHtml('blue-400', 'blue-300', 'blue-600', 'blue-200', 6, '60', 'md'),
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    }),
    selectedUnsuitable: L.divIcon({
      className: '',
      html: createMarkerIconHtml('red-500', 'red-400', 'red-600', 'red-300', 6, '60', 'md'),
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    })
  }), []);

  useEffect(() => {
    const fetchWind = async () => {
      const windData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Birkirkara&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}&units=metric`);
      const windObj = {
        speed: windData.data.wind.speed,
        degrees: windData.data.wind.deg
      }
      setWind(windObj);
    }

    const fetchData = async () => {
      const response = await fetch(beaches);
      const text = await response.text();
  
      readString(text, {
        worker: true,
        complete: (results) => {
          const newData = [];
          for (let i = 1; i < results.data.length; i++){
            const resultsData = {
              name: results.data[i][1],
              lat: results.data[i][2],
              lon: results.data[i][3],
              degreesStart: results.data[i][4],
              degreesEnd: results.data[i][5]
            }
            newData.push(resultsData);
          }
          setData(newData);
          setLoading(false);
        },
      });
    }

    fetchWind();
    fetchData();
  }, [readString]);

  useEffect(() => {
    if (loading === false && wind.speed !== undefined && wind.degrees !== undefined) {
      try {
        let newSuitability = [];
        if (wind.speed >= 8) {
            newSuitability = data.map(() => "Unsuitable");
        } else if (wind.speed >= 0 && data.length > 0) {
            for (const item of data) {
                let suitableObj2 = "";
                let windDegreesEndSolution = item.degreesEnd;

                if (wind.degrees >= 210 && item.degreesStart >= 210 && item.degreesEnd <= 50) {
                    windDegreesEndSolution = item.degreesEnd + 360;
                }

                if ((wind.degrees >= item.degreesStart) && (wind.degrees <= windDegreesEndSolution)) {
                    suitableObj2 = "Unsuitable";
                } else {
                    suitableObj2 = "Recommended";
                }

                newSuitability.push(suitableObj2);
            }
        }
        setSuitability(newSuitability);
      } catch (error) {
          console.error(error);
      }
    }
  }, [wind, loading, data])

  // Helper function to determine wind strength description
  const getWindDescription = (speed) => {
    if (speed < 2) return "Calm";
    if (speed < 4) return "Light";
    if (speed < 6) return "Moderate";
    if (speed < 8) return "Fresh";
    return "Strong";
  }

  // Helper function to scroll to map section
  const scrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle button visibility with animation transitions
  useEffect(() => {
    if (isMapModified) {
      // Show button immediately when map is modified
      setButtonVisible(true);
    } else {
      // When map returns to default, add delay before removing the button from DOM
      const timer = setTimeout(() => {
        setButtonVisible(false);
      }, 300); // Wait for fade-out animation to complete
      return () => clearTimeout(timer);
    }
  }, [isMapModified]);
  
  return(
    <div className='flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black'>
        <Header/>
        <div className="text-center flex flex-col grow">
          <h1 className="md:text-6xl text-4xl font-bold mt-5 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Beach Recommendations
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8 px-4">
            Based on current wind conditions, we recommend the following beaches for swimming and water activities
          </p>
          
          {/* Wind information panel */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl mx-auto px-6 py-4 mb-6 flex flex-wrap justify-center gap-8 max-w-4xl shadow-lg">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Wind Speed</span>
              <span className="text-2xl font-bold text-white">{wind.speed?.toFixed(1) || '...'} m/s</span>
              <span className="text-yellow-400 font-medium">{getWindDescription(wind.speed)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Direction</span>
              <span className="text-2xl font-bold text-white">{wind.degrees !== undefined ? <WindDirection windDegrees={wind.degrees} /> : '...'}</span>
              <span className="text-yellow-400 font-medium">{wind.degrees?.toFixed(0) || '...'}°</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Status</span>
              <span className={`text-2xl font-bold ${wind.speed >= 8 ? 'text-red-500' : 'text-green-500'}`}>
                {wind.speed >= 8 ? 'Warning' : 'Safe'}
              </span>
              <span className="text-yellow-400 font-medium">Conditions</span>
            </div>
          </div>

          {/* Warning display */}
          {wind.speed >= 8 && (
            <div className="mx-auto px-4 mb-6 max-w-3xl">
              <div className="bg-gradient-to-r from-red-900/70 to-orange-800/70 backdrop-blur-sm border border-red-700 text-white p-4 rounded-lg shadow-lg flex items-center">
                <TiWarningOutline className="h-10 w-10 mr-3 text-red-300 flex-shrink-0" />
                <p className="text-xl font-medium">
                  Warning: Since wind is Force 5 or greater it is not recommended to swim!
                </p>
              </div>
            </div>
          )}

          {/* Map display with improved styling */}
          <section ref={mapSectionRef} className="flex justify-center mb-10 px-4 w-full">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700 w-full max-w-7xl mx-auto" style={{ minHeight: '300px' }}>
              <MapContainer 
                center={[35.940125, 14.374125]} 
                zoom={(isDesktop) ? 11 : 10} 
                minZoom={10} 
                style={{ height: '60vh', width: '100%', minHeight: '300px' }}
                maxBounds={[[36.177098, 14.014540], [35.641324,14.802748]]} 
                maxBoundsViscosity={1} 
                doubleClickZoom={false}
                ref={mapRef}
              >
                <ZoomController isDesktop={isDesktop} />
                <MapFocuser focusLocation={focusLocation} resetFocus={resetFocus} isDesktop={isDesktop} />
                <MapClickHandler onMapClick={handleMapClick} />
                <MapStateTracker isDesktop={isDesktop} setIsMapModified={setIsMapModified} />
                <WindDirectionControl windDegrees={wind.degrees} />
                <TileLayer zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
                    subdomains={"abcd"}
                />
                {
                  data.map((data, index) => (
                    <Marker 
                      key={index} 
                      icon={
                        selectedBeach === data 
                          ? (suitability[index] === "Recommended" ? markerIcons.selectedRecommended : markerIcons.selectedUnsuitable) 
                          : (suitability[index] === "Recommended" ? markerIcons.recommended : markerIcons.unsuitable)
                      } 
                      position={[data.lat, data.lon]}
                      eventHandlers={{
                        click: () => {
                          setSelectedBeach(data);
                          setFocusLocation(data);
                        }
                      }}
                    >
                      <Popup className="custom-popup">
                          <div className="font-bold text-lg border-b pb-1 mb-1">{data.name}</div>
                          <div className={`font-medium ${suitability[index] === "Recommended" ? 'text-green-600' : 'text-red-600'}`}>
                            {suitability[index]}
                          </div>
                      </Popup> 
                    </Marker>
                  ))
                }
              </MapContainer>
            </div>
          </section>

          {/* Only show Reset Map View button when map is in a modified state */}
          <div className="mx-auto mb-6 h-10">
            <button 
              onClick={resetMapView}
              className={`bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md flex items-center cursor-pointer
                         hover:scale-105 active:scale-95 transition-all duration-300 absolute left-1/2 transform -translate-x-1/2 
                         ${buttonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
              <FaArrowLeft className="mr-2" />
              Reset Map View
            </button>
          </div>

          {/* Beach list with improved cards */}
          <section className="px-4 pb-12">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">Beach Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mb-2"></div>
                  <p>Loading beach data...</p>
                </div>
              ) : (
                data.map((beach, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      setFocusLocation(beach);
                      setSelectedBeach(beach);
                      scrollToMap(); // Scroll to map when beach card is clicked
                    }}
                    className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105 
                      ${suitability[index] === "Recommended" 
                        ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border border-green-700/50' 
                        : 'bg-gradient-to-br from-red-900/40 to-rose-800/40 border border-red-700/50'}
                      cursor-pointer relative group ${selectedBeach === beach ? 'ring-2 ring-yellow-400 ring-opacity-70' : ''}`
                    }
                  >
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${suitability[index] === "Recommended" ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <h3 className="font-bold text-lg truncate">{beach.name}</h3>
                      </div>
                      <div className={`mt-2 py-1 px-3 inline-block rounded-full text-sm font-medium ${
                        suitability[index] === "Recommended" 
                          ? 'bg-green-800/60 text-green-200' 
                          : 'bg-red-800/60 text-red-200'
                      }`}>
                        {suitability[index]}
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                          <FaRegEye className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
        <Footer />
    </div>
  )
}

// Add a new component to handle map clicks
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    map.on('click', onMapClick);
    
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick]);
  
  return null;
}

// Wind direction arrow control for the map
function WindDirectionControl({ windDegrees }) {
  const map = useMap();
  const [container, setContainer] = useState(null);
  
  useEffect(() => {
    // Create custom Leaflet control for wind direction
    if (!map) return;
    
    const windControl = L.control({ position: 'topright' });
    
    windControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-control wind-direction-control');
      setContainer(div);
      
      // Prevent map interactions from propagating through the control
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      
      return div;
    };
    
    windControl.addTo(map);
    
    return () => {
      if (map && windControl) {
        windControl.remove();
        setContainer(null);
      }
    };
  }, [map]);
  
  // Only render the portal when container is available
  if (!container || windDegrees === undefined) return null;
  
  return createPortal(
    <div className="h-14 w-14 flex items-center justify-center bg-gray-700/90 rounded-full border border-gray-600">
      <div style={{ 
        transform: `rotate(${(windDegrees + 180) % 360}deg)`,
        transition: 'transform 0.5s ease-in-out'
      }}>
        <LiaLocationArrowSolid className="h-9 w-9 text-red-400" />
      </div>
    </div>,
    container
  );
}