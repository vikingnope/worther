import { MapContainer, TileLayer } from 'react-leaflet';
import '../styles/map.css';

const Map = () => {
    return (
        <MapContainer center={[36.505, 15.09]} zoom={6} >
  
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}

export default Map;