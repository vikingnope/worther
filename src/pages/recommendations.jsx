import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { usePapaParse } from 'react-papaparse';
import L from 'leaflet';
import markerDot from "../resources/location-dot.png";
import { useState } from "react";
import { useEffect } from "react";

export default function Recommendations () {
  const { readString } = usePapaParse();
  const [ data, setData ] = useState([]);

  const csvString=`Num,Name,Lat,Lon
1,Wied Iz-Zurrieq,35.820148,14.451877
2,Ghar Lapsi,35.826847,14.423327`;

  const markerIconConst = L.icon({
    iconUrl: markerDot,
    iconRetinaUrl: markerDot,
    iconAnchor: [13, 14],
    popupAnchor: [0, -13],
    iconSize: [26.5, 28]
  });

  useEffect(() => {
    readString(csvString, {
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
  }, [])

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
                        <p className="font-bold justify-center flex text-green-500">Available</p>
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
                <p className="font-bold text-xl mr-5 mt-4 ml-3 mb-4">{data.num}</p>
                <p className="font-bold text-xl mt-4 block">{data.name}</p>
              </div>
            )
          )}
          </section>
        </div>
        <Footer />
    </div>
  )
}