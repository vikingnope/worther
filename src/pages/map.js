import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useGeolocated } from "react-geolocated";
import '../styles/map.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L, { divIcon } from 'leaflet';

const Map = () => {

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    const markerIconConst = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [35, 50],
    });

    const coordinatesMap = (coordinatesLatitude, coordinatesLongitude, zoomLevel) => {
        return(
            <MapContainer center={[coordinatesLatitude, coordinatesLongitude]} zoom={zoomLevel} minZoom={3}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {isGeolocationEnabled ? (
                    <Marker icon = {markerIconConst} position={[coordinatesLatitude, coordinatesLongitude]}>
                        <Popup>
                            Location: 
                        </Popup>
                    </Marker>
                ) : (
                    console.log()
                )}
            </MapContainer> 
        );
    }

    return coords ? (
        coordinatesMap(coords.latitude, coords.longitude, 10)
    ) : !isGeolocationAvailable || !isGeolocationEnabled ? (
        coordinatesMap(45, 10, 5)
    ) : (
        console.log()
    )
}

export default Map;