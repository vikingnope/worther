import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { RainViewerData }  from '../components/rainViewerData';
import { SatelliteData } from '../components/satelliteData';
import {MenuBar} from '../components/MenuBar';

export default function Map(props) {   
    const [userPos, setUserPos] = useState({latitude: "45", longitude: "10"});
    const [weatherOpacity, setWeatherOpacity] = useState(props.weatherOpacity || 0.5);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) =>{
            const newUserPos = { 
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
             };
            setUserPos(newUserPos);
       })
    }, []);


    const markerIconConst = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [35, 50],
    });

    return(
        <MapContainer center={[userPos.latitude, userPos.longitude]} zoom={6} minZoom={2} style={{ height: '100vh', width: '100%'}} maxBounds={[[-180, -180], [180, 180]]} maxBoundsViscosity={0.75}>
            <TileLayer zIndex={1} className="pointer-events-none"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SatelliteData />
            <RainViewerData opacity={weatherOpacity}/>
            <MenuBar weatherOpacity={weatherOpacity} onWeatherOpacityChange={setWeatherOpacity}/>
            {userPos.latitude !== 45 && userPos.longitude !== 10 ? (
                <Marker icon = {markerIconConst} position={[userPos.latitude, userPos.longitude]}>
                    <Popup>
                        Location: 
                    </Popup>
                </Marker>
            ) : (
                console.log('Marker failed to load.')
            )}
        </MapContainer>
    );
}