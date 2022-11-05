import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { usePapaParse } from 'react-papaparse';
import L from 'leaflet';
import markerDot from "../resources/location-dot.png";
import { useState, useEffect } from "react";
import axios from "axios";
import beaches from "../resources/beaches.csv";

export default function Recommendations () {
  const { readString } = usePapaParse();
  const [ csvFile, setCSVFile ] = useState();
  const [ data, setData ] = useState([]);
  const [ availability, setAvailability ] = useState([]);
  const [ windDegrees,  setWindDegrees ] = useState();

  const markerIconConst = L.icon({
    iconUrl: markerDot,
    iconRetinaUrl: markerDot,
    iconAnchor: [13, 14],
    popupAnchor: [0, -13],
    iconSize: [26.5, 28]
  });

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Birkirkara&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`)
    .then(response => {
      setWindDegrees( response.data.wind.deg);
    })
  }, []);

  useEffect(() => {
    fetch(beaches)
    .then((r) => r.text())
    .then(text  => {
      setCSVFile(text);
    })

    readString(csvFile, {
      worker: true,
      complete: (results) => {
        for (let i = 1; i < results.data.length; i++){
          const resultsData = {
            num: results.data[i][0],
            name: results.data[i][1],
            lat: results.data[i][2],
            lon: results.data[i][3]
          }
          setData(data => [...data, resultsData])
        }
      },
    });
  }, [csvFile])

  return (
    <div className='select-none text-white'>
        <Header choice={'recommendations'}/>
        <div className="text-center bg-black flex min-h-screen flex-col">
          <p className="text-5xl font-bold underline mt-3 mb-8">Recommendations</p>
          <section className="my-auto justify-center flex">
            <MapContainer center={[35.940125, 14.374125]} zoom={11} minZoom={10} style={{ height: '82vh', width: '110vh', borderRadius: '7px'}} maxBounds={[[36.177098, 14.014540], [35.641324,14.802748]]} maxBoundsViscosity={1} doubleClickZoom={false}>
              <TileLayer zIndex={1}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
              {
                data.map((data, index) => (
                  <Marker key={index} icon = {markerIconConst} position={[data.lat, data.lon]}>
                    <Popup>
                        <p className="font-bold underline flex justify-center" id="markerText">{data.name}</p>
                        <p className="underline border-b border-black"></p>
                        <p className="font-bold justify-center flex text-green-500">Safe</p>
                    </Popup> 
                  </Marker>
                )
              )}
              
            </MapContainer>
          </section>
          <section className="mt-8 border-t-2 border-white w-full h-72 block"> 
          {
            data.map((data, index) => (
              <div key={index} className="flex border-b-2">
                <span className="font-bold text-xl mr-5 mt-4 ml-3 mb-4">{data.num}.</span>
                <span className="font-bold text-xl mt-4">{data.name}</span>
                {
                  (availability === "Safe") ?
                    <span className="font-bold text-xl mt-4 text-green-500">{availability}</span> :
                    <span className="font-bold text-xl mt-4 text-red-600">{availability}</span>
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