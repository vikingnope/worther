import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { usePapaParse } from 'react-papaparse';
import L from 'leaflet';
import markerDotBlue from "../resources/location-dot.png";
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import beaches from "../resources/beaches.csv";
import markerDotRed from "../resources/location-dot-red.png";
import { useDeviceDetect } from "../hooks/useDeviceDetect";
import 'leaflet/dist/leaflet.css';
import { FaArrowLeft, FaRegEye } from "react-icons/fa6";
import { TiWarningOutline } from "react-icons/ti";

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
function MapFocuser({ focusLocation, resetFocus }) {
  const map = useMap();
  
  useEffect(() => {
    if (focusLocation) {
      map.setView([focusLocation.lat, focusLocation.lon], 14);
    }
  }, [focusLocation, map]);

  useEffect(() => {
    if (resetFocus) {
      map.setView([35.940125, 14.374125], 11);
    }
  }, [resetFocus, map]);
  
  return null;
}

export default function Recommendations () {
  const { readString } = usePapaParse();
  const [ data, setData ] = useState([]);
  const [ wind, setWind ] = useState([]);
  const [ suitability, setSuitability ] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useDeviceDetect(768); // 768px is the breakpoint for desktop (i.e. md size in tailwindcss)
  
  // State for focused beach location
  const [focusLocation, setFocusLocation] = useState(null);
  const [resetFocus, setResetFocus] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState(null); // Track selected beach
  const mapRef = useRef(null);

  const markerIcons = useMemo(() => ({
    recommended: L.icon({
      iconUrl: markerDotBlue,
      iconRetinaUrl: markerDotBlue,
      iconAnchor: [13, 14],
      popupAnchor: [0, -13],
      iconSize: [26.5, 28]
    }),
    unsuitable: L.icon({
      iconUrl: markerDotRed,
      iconRetinaUrl: markerDotRed,
      iconAnchor: [13, 14],
      popupAnchor: [0, -13],
      iconSize: [26.5, 28]
    }),
    // Add larger versions of the icons for the selected beach
    selectedRecommended: L.icon({
      iconUrl: markerDotBlue,
      iconRetinaUrl: markerDotBlue,
      iconAnchor: [18, 19],
      popupAnchor: [0, -18],
      iconSize: [37, 39],
      className: 'pulse-marker'
    }),
    selectedUnsuitable: L.icon({
      iconUrl: markerDotRed,
      iconRetinaUrl: markerDotRed,
      iconAnchor: [18, 19],
      popupAnchor: [0, -18],
      iconSize: [37, 39],
      className: 'pulse-marker'
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
        if (wind.speed >= 8) {
            setSuitability(data.map(() => "Unsuitable"));
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

                setSuitability(suitability => [...suitability, suitableObj2]);
            }
        }
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

  // Helper function to convert wind degrees to cardinal direction
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  return(
    <div className='text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black flex flex-col min-h-screen'>
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
              <span className="text-2xl font-bold text-white">{getWindDirection(wind.degrees) || '...'}</span>
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
          <section className="flex justify-center mb-10 px-4">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <MapContainer 
                center={[35.940125, 14.374125]} 
                zoom={(isDesktop) ? 11 : 10} 
                minZoom={10} 
                className="md:h-[75vh] w-[110vh] h-[60vh]" 
                maxBounds={[[36.177098, 14.014540], [35.641324,14.802748]]} 
                maxBoundsViscosity={1} 
                doubleClickZoom={false}
                ref={mapRef}
              >
                <ZoomController isDesktop={isDesktop} />
                <MapFocuser focusLocation={focusLocation} resetFocus={resetFocus} />
                <TileLayer zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
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

          {focusLocation && (
            <div className="mx-auto mb-6">
              <button 
                onClick={() => {
                  setFocusLocation(null);
                  setResetFocus(true);
                  setTimeout(() => setResetFocus(false), 100);
                }}
                className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center cursor-pointer"
              >
                <FaArrowLeft className="mr-2" />
                Reset Map View
              </button>
            </div>
          )}

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