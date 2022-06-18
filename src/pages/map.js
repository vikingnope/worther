import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, {useEffect, state, setState} from 'react';
import 'leaflet/dist/leaflet.css';
import { GetRainViewerData }  from '../components/rainViewerData';

export const Map = () => {
    state = {
        longitude: 14,
        latitude: 35,
    };

    useEffect(() =>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setState(state => (({
                    latitude: position.coords.latitude, 
                    longitude: position.coords.longitude
                }), () => {
                    console.log(state.longitude);
                    console.log(state.latitude);
                }))
            });
        }
    })


    const markerIconConst = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [35, 50],
    });

    return(
        <MapContainer center={[state.latitude, state.longitude]} zoom={6} minZoom={3} style={{ height: '100vh', width: '100%'}}>
            <TileLayer zIndex={1}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer zIndex={2} opacity={0.1} tileSize={1920} updateInterval={5000}
                url={"https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=1920&width=1920&crs=EPSG:4326&format=image/png&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=-180,-89,180,89"}
            />
            <GetRainViewerData />
            {state.latitude !== 45 && state.longitude !== 10 ? (
                <Marker icon = {markerIconConst} position={[state.latitude, state.longitude]}>
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