import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useGeolocated } from "react-geolocated";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GetRainViewerData } from '../components/rainViewerData';

export const Map = () => {
    const RainViewerLayerReturn = GetRainViewerData();
    
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

    const RainViewerLayer = L.tileLayer({
        url: '',
        styles: { height: '100vh', width: '100%'}
    })
    
    const coordinatesMap = (coordinatesLatitude, coordinatesLongitude, zoomLevel) => {
        return(
            <MapContainer center={[coordinatesLatitude, coordinatesLongitude]} zoom={zoomLevel} minZoom={3} style={{ height: '100vh', width: '100%'}}>
                <TileLayer zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TileLayer zIndex={2} opacity={1}
                    url="https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=1080&width=1920&crs=EPSG:4326&format=image/png&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=-180,-180,180,180"
                />
                <TileLayer zIndex={3} opacity={1}
                    url = {RainViewerLayerReturn}
                />
                {isGeolocationEnabled ? (
                    <Marker icon = {markerIconConst} position={[coordinatesLatitude, coordinatesLongitude]}>
                        <Popup>
                            Location: 
                        </Popup>
                    </Marker>
                ) : (
                    console.log('Failed')
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