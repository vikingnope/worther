import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaArrowLeft, FaRegEye } from 'react-icons/fa6';
import { LiaLocationArrowSolid } from 'react-icons/lia';
import { TiWarningOutline } from 'react-icons/ti';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { usePapaParse } from 'react-papaparse';

import { Footer } from '../components/utils/footer';
import { Header } from '../components/utils/header';
import { CustomZoomControl, CustomAttributionControl } from '../components/utils/mapElements';
import { WindDirection } from '../components/utils/weatherVariables';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import beaches from '../resources/beaches.csv';

// Map configuration constants
const MAP_CENTER = [35.940125, 14.374125];
const DESKTOP_ZOOM = 11;
const MOBILE_ZOOM = 10;
const MAP_BOUNDS = [
  [36.177098, 14.01454],
  [35.641324, 14.802748],
];

// Helper function to create marker icon HTML with direct color values
// Moved outside component to prevent recreation on each render
const createMarkerIconHtml = (
  bgColor,
  gradientFrom,
  gradientTo,
  borderColor,
  size,
  glowOpacity,
  blurSize
) => {
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
    'red-200': '#fecaca',
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

// Component to control zoom based on device detection
function ZoomController({ isDesktop }) {
  const map = useMap();

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
            duration: 1,
          },
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusLocation, map, isDesktop]);

  useEffect(() => {
    if (resetFocus) {
      // Set different default views based on device
      map.setView(MAP_CENTER, isDesktop ? DESKTOP_ZOOM : MOBILE_ZOOM, {
        animate: true,
      });
    }
  }, [resetFocus, map, isDesktop]);

  return null;
}

// Add a new component to track map state
function MapStateTracker({ isDesktop, setIsMapModified }) {
  const map = useMap();
  const initialStateRef = useRef(true); // Reference to track initial state

  // Check if the map is in its default state
  const checkMapState = useCallback(() => {
    if (!map) return;

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    // Allow for small differences in center position (rounding errors)
    const centerDiff =
      Math.abs(currentCenter.lat - MAP_CENTER[0]) + Math.abs(currentCenter.lng - MAP_CENTER[1]);

    // Map is in default state if zoom is default (exact match) and center is approximately default
    // Using a more generous tolerance for center position for laptops especially
    const isDefault = currentZoom === (isDesktop ? DESKTOP_ZOOM : MOBILE_ZOOM) && centerDiff < 0.1;

    // Update state only if there's a change
    setIsMapModified(!isDefault);

    // Reset initial state marker once we've confirmed the map has moved from default
    if (!isDefault && initialStateRef.current) {
      initialStateRef.current = false;
    }
  }, [map, setIsMapModified, isDesktop]);

  // Force reset map modified state when resetMapView is called
  const forceResetMapState = useCallback(() => {
    // Set a small delay to ensure the map animation has completed
    setTimeout(() => {
      setIsMapModified(false);
      initialStateRef.current = true;

      // Dispatch custom event to notify Leaflet that reset is complete
      if (map) {
        map.fire('resetComplete');
      }
    }, 500); // Increased delay for more reliable reset
  }, [map, setIsMapModified]);

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
  }, [map, checkMapState, forceResetMapState]);

  // Reset check when defaultZoom changes (device type changes)
  useEffect(() => {
    checkMapState();
  }, [isDesktop, checkMapState]);

  return null;
}

export default function Recommendations() {
  const { readString } = usePapaParse();
  const [data, setData] = useState([]);
  const [wind, setWind] = useState([]);
  const [suitability, setSuitability] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useDeviceDetect(1280); // 1280px (xl) is the breakpoint for desktop (i.e. md size in tailwindcss)

  // Add error state variables
  const [blocked, setBlocked] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [dataError, setDataError] = useState(false);

  // State for focused beach location
  const [focusLocation, setFocusLocation] = useState(null);
  const [resetFocus, setResetFocus] = useState(false);
  const [selectedBeachNum, setSelectedBeachNum] = useState(null); // Track selected beach by num instead of object
  const [isMapModified, setIsMapModified] = useState(false); // Track if map is in modified state
  const [buttonVisible, setButtonVisible] = useState(false); // Track button visibility for animation
  const mapRef = useRef(null);
  const mapSectionRef = useRef(null); // Ref for the map section to scroll to

  useEffect(() => {
    document.title = 'Worther - Beach Recommendations';
  }, []);

  // Add this function to handle map clicks
  const handleMapClick = useCallback(() => {
    if (selectedBeachNum) {
      setSelectedBeachNum(null);
      setFocusLocation(null);
    }
  }, [selectedBeachNum]);

  // Function to reset map view
  const resetMapView = () => {
    // Close any open popups
    if (mapRef.current) {
      mapRef.current.closePopup();
    }

    setSelectedBeachNum(null);
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

  const markerIcons = useMemo(
    () => ({
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
      }),
    }),
    []
  );

  // Move fetchWind outside useEffect so it can be reused
  const fetchWind = async () => {
    try {
      const windData = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Birkirkara&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const windObj = {
        speed: windData.data.wind.speed,
        degrees: windData.data.wind.deg,
      };
      setWind(windObj);
    } catch (error) {
      console.error('Error fetching wind data:', error);
      // Handle different error types
      if (error.response) {
        // API responded with an error status
        if (error.response.status === 401 || error.response.status === 403) {
          setBlocked(true);
        } else {
          setDataError(true);
        }
      } else if (error.request) {
        // No response received from the server
        setConnectionError(true);
      } else {
        // Error in setting up the request
        setDataError(true);
      }
    }
  };

  // Move fetchData outside useEffect and wrap it in useCallback to prevent it from changing on every render
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(beaches);
      const text = await response.text();

      readString(text, {
        worker: true,
        complete: results => {
          const newData = [];
          for (let i = 1; i < results.data.length; i++) {
            const resultsData = {
              num: parseInt(results.data[i][0]), // Add the unique num field
              name: results.data[i][1],
              lat: results.data[i][2],
              lon: results.data[i][3],
              degreesStart: results.data[i][4],
              degreesEnd: results.data[i][5],
            };
            newData.push(resultsData);
          }
          setData(newData);
          setLoading(false);
        },
        error: error => {
          console.error('CSV parsing error:', error);
          setDataError(true);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error fetching beach data:', error);
      setConnectionError(true);
      setLoading(false);
    }
  }, [readString]);

  // Function to handle refreshing data
  const refreshData = () => {
    // Reset error states
    setBlocked(false);
    setConnectionError(false);
    setDataError(false);
    // Set loading state
    setLoading(true);
    // Fetch data again
    fetchWind();
    fetchData();
  };

  useEffect(() => {
    fetchWind();
    fetchData();
  }, [readString, fetchData]);

  useEffect(() => {
    if (loading === false && wind.speed !== undefined && wind.degrees !== undefined) {
      try {
        let newSuitability = [];
        if (wind.speed >= 8) {
          newSuitability = data.map(() => 'Unsuitable');
        } else if (wind.speed >= 0 && data.length > 0) {
          for (const item of data) {
            let suitableObj2 = '';
            let windDegreesEndSolution = item.degreesEnd;

            if (wind.degrees >= 210 && item.degreesStart >= 210 && item.degreesEnd <= 50) {
              windDegreesEndSolution = item.degreesEnd + 360;
            }

            if (wind.degrees >= item.degreesStart && wind.degrees <= windDegreesEndSolution) {
              suitableObj2 = 'Unsuitable';
            } else {
              suitableObj2 = 'Recommended';
            }

            newSuitability.push(suitableObj2);
          }
        }
        setSuitability(newSuitability);
      } catch (error) {
        console.error(error);
      }
    }
  }, [wind, loading, data]);

  const getWindDescription = speed => {
    if (speed < 0.5) return 'Calm'; // Beaufort 0
    if (speed < 1.5) return 'Light Air'; // Beaufort 1
    if (speed < 3.3) return 'Light Breeze'; // Beaufort 2
    if (speed < 5.5) return 'Gentle Breeze'; // Beaufort 3
    if (speed < 7.9) return 'Moderate Breeze'; // Beaufort 4
    if (speed < 10.7) return 'Fresh Breeze'; // Beaufort 5
    return 'Strong Breeze'; // Beaufort 6+
  };

  // Helper function to scroll to map section, memoized to prevent rerender
  const scrollToMap = useCallback(() => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

  const beachMarkers = useMemo(
    () =>
      data.map((beach, index) => (
        <Marker
          key={index}
          icon={
            selectedBeachNum === beach.num
              ? suitability[index] === 'Recommended'
                ? markerIcons.selectedRecommended
                : markerIcons.selectedUnsuitable
              : suitability[index] === 'Recommended'
                ? markerIcons.recommended
                : markerIcons.unsuitable
          }
          position={[beach.lat, beach.lon]}
          eventHandlers={{
            click: () => {
              setSelectedBeachNum(beach.num);
              setFocusLocation({ lat: beach.lat, lon: beach.lon });
            },
          }}
        >
          <Popup className="custom-popup">
            <div className="font-bold text-lg border-b pb-1 mb-1">{beach.name}</div>
            <div
              className={`font-medium ${suitability[index] === 'Recommended' ? 'text-green-600' : 'text-red-600'}`}
            >
              {suitability[index]}
            </div>
          </Popup>
        </Marker>
      )),
    [data, suitability, selectedBeachNum, markerIcons]
  );

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header />
      <div className="text-center flex flex-col grow">
        <h1 className="md:text-6xl text-4xl font-bold mt-5 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          Beach Recommendations
        </h1>

        {/* Show appropriate error messages or the actual content */}
        {blocked ? (
          <ErrorDisplay
            message="The API is currently blocked"
            details="Unable to retrieve wind data"
            refreshData={refreshData}
          />
        ) : connectionError ? (
          <ErrorDisplay
            message="Please check your internet connection"
            details="Cannot connect to weather or map services"
            refreshData={refreshData}
          />
        ) : dataError ? (
          <ErrorDisplay
            message="Error loading beach data"
            details="There was a problem retrieving beach information"
            refreshData={refreshData}
          />
        ) : loading ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-8 rounded-xl border border-blue-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-sm max-w-md">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-blue-700/70 mb-5 animate-spin"></div>
                <div className="h-7 w-64 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md mb-4"></div>
                <div className="h-5 w-48 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md"></div>
                <p className="mt-5 text-gray-400 font-medium">Loading beach and weather data...</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-300 max-w-3xl mx-auto mb-8 px-4">
              Based on current wind conditions, we recommend the following beaches for swimming and
              water activities
            </p>

            {/* Wind information panel */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl mx-auto px-6 py-4 mb-6 flex flex-wrap justify-center gap-8 max-w-4xl shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Wind Speed</span>
                <span className="text-2xl font-bold text-white">
                  {wind.speed?.toFixed(1) || '...'} m/s
                </span>
                <span className="text-yellow-400 font-medium">
                  {getWindDescription(wind.speed)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Direction</span>
                <span className="text-2xl font-bold text-white">
                  {wind.degrees !== undefined ? (
                    <WindDirection windDegrees={wind.degrees} />
                  ) : (
                    '...'
                  )}
                </span>
                <span className="text-yellow-400 font-medium">
                  {wind.degrees?.toFixed(0) || '...'}°
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Status</span>
                <span
                  className={`text-2xl font-bold ${wind.speed >= 8 ? 'text-red-500' : 'text-green-500'}`}
                >
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
              <div
                className="rounded-xl overflow-hidden shadow-2xl border border-gray-700 w-full max-w-7xl mx-auto"
                style={{ minHeight: '300px' }}
              >
                <MapContainer
                  center={MAP_CENTER}
                  zoom={isDesktop ? DESKTOP_ZOOM : MOBILE_ZOOM}
                  minZoom={10}
                  style={{ height: '60vh', width: '100%', minHeight: '300px' }}
                  maxBounds={MAP_BOUNDS}
                  maxBoundsViscosity={1}
                  doubleClickZoom={false}
                  ref={mapRef}
                >
                  <ZoomController isDesktop={isDesktop} />
                  <CustomZoomControl mapType="light" />
                  <CustomAttributionControl mapType="light" />
                  <MapFocuser
                    focusLocation={focusLocation}
                    resetFocus={resetFocus}
                    isDesktop={isDesktop}
                  />
                  <MapClickHandler onMapClick={handleMapClick} />
                  <MapStateTracker isDesktop={isDesktop} setIsMapModified={setIsMapModified} />
                  <WindDirectionControl windDegrees={wind.degrees} />
                  <TileLayer
                    zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={
                      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
                    }
                    subdomains={'abcd'}
                  />
                  {beachMarkers}
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
                {data.map((beach, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setFocusLocation({ lat: beach.lat, lon: beach.lon });
                      setSelectedBeachNum(beach.num);
                      scrollToMap(); // Scroll to map when beach card is clicked
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFocusLocation({ lat: beach.lat, lon: beach.lon });
                        setSelectedBeachNum(beach.num);
                        scrollToMap();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${beach.name} on map - ${suitability[index]}`}
                    className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105 
                        ${
                          suitability[index] === 'Recommended'
                            ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border border-green-700/50'
                            : 'bg-gradient-to-br from-red-900/40 to-rose-800/40 border border-red-700/50'
                        }
                        cursor-pointer relative group ${selectedBeachNum === beach.num ? 'ring-2 ring-yellow-400 ring-opacity-70' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${suitability[index] === 'Recommended' ? 'bg-green-500' : 'bg-red-500'}`}
                        ></div>
                        <h3 className="font-bold text-lg truncate">{beach.name}</h3>
                      </div>
                      <div
                        className={`mt-2 py-1 px-3 inline-block rounded-full text-sm font-medium ${
                          suitability[index] === 'Recommended'
                            ? 'bg-green-800/60 text-green-200'
                            : 'bg-red-800/60 text-red-200'
                        }`}
                      >
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
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
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

    let div = null;

    windControl.onAdd = function () {
      div = L.DomUtil.create('div', 'leaflet-control wind-direction-control');
      setContainer(div);

      // Prevent map interactions from propagating through the control
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      return div;
    };

    windControl.addTo(map);

    return () => {
      if (map && windControl) {
        if (div) {
          L.DomEvent.disableClickPropagation(div);
          L.DomEvent.disableScrollPropagation(div);
        }
        windControl.remove();
        setContainer(null);
      }
    };
  }, [map]);

  // Only render the portal when container is available
  if (!container || windDegrees === undefined) return null;

  return createPortal(
    <div className="h-14 w-14 flex items-center justify-center bg-gray-700/90 rounded-full border border-gray-600">
      <div
        style={{
          transform: `rotate(${(windDegrees + 180) % 360}deg)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        <LiaLocationArrowSolid className="h-9 w-9 text-red-400" />
      </div>
    </div>,
    container
  );
}

// Error display component
const ErrorDisplay = ({ message, details, refreshData }) => (
  <div className="text-white flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto">
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8 text-center border border-blue-900/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      <div className="mb-8">
        <TiWarningOutline size={60} className="mx-auto text-red-400 mb-4" />
        <p className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-amber-300">
          {message}
        </p>
        {details && <p className="text-xl text-gray-300 mt-2">{details}</p>}
        <p className="text-gray-400 mt-3">Unable to retrieve beach recommendation data</p>
      </div>
      <button
        onClick={refreshData}
        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium cursor-pointer"
      >
        Refresh Data
      </button>
    </div>
  </div>
);
