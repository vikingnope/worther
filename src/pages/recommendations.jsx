import { Header } from "../components/utils/header";
import { Footer  } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import maltaMap from '../resources/maltaMap.png';
import L from 'leaflet';
import markerDot from "../resources/location-dot.png";


export default function Recommendations () {

  const markerIconConst = L.icon({
    iconUrl: markerDot,
    iconRetinaUrl: markerDot,
    iconAnchor: [13, 14],
    popupAnchor: [0, -13],
    iconSize: [26.5, 28]
  });

  return (
    <div className='select-none text-white'>
        <Header choice={'recommendations'}/>
        <div className="text-center bg-black flex min-h-screen flex-col">
          <p className="text-5xl font-bold underline mt-3 mb-8">Recommendations</p>
          <section className="my-auto justify-center flex">
            <MapContainer center={[35.940125, 14.374125]} zoom={11} minZoom={11} style={{ height: '82vh', width: '110vh', borderRadius: '7px'}} maxBounds={[[36.237281, 13.910769], [35.641324,14.802748]]} maxBoundsViscosity={0.75} doubleClickZoom={false}>
              <TileLayer zIndex={1}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
              <Marker icon = {markerIconConst} position={[35.820148, 14.451877]}>
                <Popup>
                    <p className="font-bold underline" id="markerText">Wied Iz-Zurrieq</p>
                </Popup> 
              </Marker>
            </MapContainer>
          </section>
          <section className="mt-8 border-t-2 border-white w-full h-72"> 

          </section>
        </div>
        <Footer />
    </div>
  )
}