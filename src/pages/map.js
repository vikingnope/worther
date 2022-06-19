import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { GetRainViewerData }  from '../components/rainViewerData';

export function Map() {

    const [userPos, setUserPos] = useState({latitude: "45", longitude: "10"});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) =>{
            const newUserPos = { 
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
             };
            setUserPos(newUserPos)
       })
    })


    const markerIconConst = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [35, 50],
    });

    return(
        <MapContainer center={[userPos.latitude, userPos.longitude]} zoom={6} minZoom={3} style={{ height: '100vh', width: '100%'}}>
            <TileLayer zIndex={1}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer zIndex={2} opacity={0.1} tileSize={1920} updateInterval={5000}
                url={"https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=1920&width=1920&crs=EPSG:4326&format=image/png&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=-180,-89,180,89"}
            />
            <GetRainViewerData />
            {userPos.latitude !== 45 && userPos.longitude !== 10 ? (
                <Marker icon = {markerIconConst} position={[userPos.latitude, userPos.longitude]}>
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