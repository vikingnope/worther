import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { usePapaParse } from 'react-papaparse';
import L from 'leaflet';
import markerDotBlue from "../resources/location-dot.png";
import { useState, useEffect } from "react";
import axios from "axios";
import beaches from "../resources/beaches.csv";
import markerDotRed from "../resources/location-dot-red.png";

export default function Recommendations () {
  const { readString } = usePapaParse();
  const [ data, setData ] = useState([]);
  const [ wind, setWind ] = useState([]);
  const [ suitability, setSuitability ] = useState([]);
  const [loading, setLoading] = useState(true);

  const markerIconConstRecommended = L.icon({
    iconUrl: markerDotBlue,
    iconRetinaUrl: markerDotBlue,
    iconAnchor: [13, 14],
    popupAnchor: [0, -13],
    iconSize: [26.5, 28]
  });


  const markerIconConstUnsuitable = L.icon({
    iconUrl: markerDotRed,
    iconRetinaUrl: markerDotRed,
    iconAnchor: [13, 14],
    popupAnchor: [0, -13],
    iconSize: [26.5, 28]
  });

  useEffect(() => {
    const fetchWind = async () => {
      const windData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Birkirkara&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`);
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
  }, []);

  useEffect(() => {
    if (loading === false && wind.speed !== undefined && wind.degrees !== undefined) {
      if (wind.speed >= 8) {
        for(let i = 0; i < data.length; i++){
          let suitableObj = "Unsuitable";

          setSuitability(suitability => [...suitability, suitableObj]);
        }
      } else if (wind.speed >= 0 && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let suitableObj2 = "";
          let windDegreesEndSolution = "";

          if(wind.degrees >= 210 && data[i].degreesStart >= 210 && data[i].degreesEnd <= 50){
            windDegreesEndSolution = data[i].degreesEnd + 360;
          } else {
            windDegreesEndSolution = data[i].degreesEnd;
          } 

          if(((wind.degrees >= data[i].degreesStart) && (wind.degrees <= windDegreesEndSolution))) {
            suitableObj2 = "Unsuitable";
          } else {
            suitableObj2 = "Recommended";
          }

          setSuitability(suitability => [...suitability, suitableObj2]);
        }
      } else {
        for(let i = 0; i < data.length; i++){
          let suitableObj = "";

          setSuitability(suitability => [...suitability, suitableObj]);
        }
      }
    }
  }, [wind, loading, data])

  return(
    <div className='select-none text-white'>
        <Header choice={'recommendations'}/>
        <div className="text-center bg-black flex min-h-screen flex-col">
          <p className="text-6xl font-bold underline mt-4 mb-8 text-yellow-400">
            Recommendations
          </p>
          <section className="my-auto justify-center flex">
            <MapContainer center={[35.940125, 14.374125]} zoom={11} minZoom={10} style={{ height: '82vh', width: '110vh', borderRadius: '7px'}} maxBounds={[[36.177098, 14.014540], [35.641324,14.802748]]} maxBoundsViscosity={1} doubleClickZoom={false}>
              <TileLayer zIndex={1}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
              {
                data.map((data, index) => (
                  <Marker key={index} icon = {(suitability[index] === "Recommended") ? markerIconConstRecommended : markerIconConstUnsuitable} position={[data.lat, data.lon]}>
                    <Popup>
                        <p className="font-bold underline flex justify-center" id="markerText">{data.name}</p>
                        {
                        (suitability[index] === "Recommended") ?
                          <span className="font-bold justify-center flex text-green-500">{suitability[index]}</span> :
                          <span className="font-bold justify-center flex text-red-600">{suitability[index]}</span>
                        }
                    </Popup> 
                  </Marker>
                )
              )}
              
            </MapContainer>
          </section>
          <section className="mt-8 w-3/4 h-max block mx-auto">
            {
              (wind.speed >= 8) ?
                <p className="text-3xl font-bold underline border-3 rounded-lg p-3 border-orange-600">
                  Warning: Since wind is Force 5 or greater it is not recommended to swim!
                </p> :
                <></>
            }
          </section>
          <section className="my-8 h-max grid grid-cols-4 gap-4 px-6"> 
          {
            data.map((data, index) => (
              <div key={index} className="flex border-2 rounded-xl" id="recommendations">
                <span className="font-bold text-xl mr-3 my-4 ml-3">{index + 1}.</span>
                <span className="font-bold text-xl my-4 mr-3">{data.name}:</span>
                {
                  (suitability[index] === "Recommended") ?
                    <span className="font-bold text-2xl my-3.5 text-green-500">{suitability[index]}</span> :
                    <span className="font-bold text-2xl my-3.5 text-red-600">{suitability[index]}</span>
                }
              </div>
            )
          )}
          </section>
        </div>
      <Footer />
    </div>
  )
}