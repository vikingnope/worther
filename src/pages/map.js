import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useGeolocated } from "react-geolocated";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L, { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';


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
            <MapContainer center={[coordinatesLatitude, coordinatesLongitude]} zoom={zoomLevel} minZoom={3} style={{ height: '100vh', width: '100%'}}>
                <TileLayer zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TileLayer zIndex={2} opacity={0.1}
                    url="https://view.eumetsat.int/geoserver/ows?acc10ss_token=30d87bed-a83e-38ec-96d1-5a0a4a9f601c&service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&styles=&format=image/png&crs=EPSG:4326&bbox=-89.9999008178711,-180,89.9999008178711,180&width=1920&height=1080"
                />
                <TileLayer zIndex={3} opacity={1}
                    url="https://tilecache.rainviewer.com/v2/radar/1654670400/16000/2/0_1.png"
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