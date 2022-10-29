import { Header } from "../components/utils/header";
import { Footer  } from "../components/utils/footer";
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

export default function Recommendations () {
  return (
    <div className='select-none text-white'>
        <Header choice={'recommendations'}/>
        <div className="text-center bg-black flex min-h-screen flex-col">
          <p className="text-5xl font-bold underline mt-3 mb-8">Recommendations</p>
          <section className="my-auto justify-center flex rounded">
            <MapContainer center={[35.940125, 14.374125]} zoomControl={false} zoom={11.26} style={{ height: '82vh', width: '110vh', borderRadius: '6px'}} doubleClickZoom={false} scrollWheelZoom={false} closePopupOnClick= {false} dragging = {false} zoomSnap = {false} zoomDelta = {false} trackResize = {false} touchZoom = {false}>
              <TileLayer zIndex={1}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
            </MapContainer>
          </section>
          <section className="mt-8 border-t-2 border-white w-full h-72">
            
          </section>
        </div>
        <Footer />
    </div>
  )
}