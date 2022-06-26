import { MapContainer, TileLayer, Marker, Popup , ScaleControl} from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { RainViewerData }  from '../components/rainViewerData';
import { SatelliteData } from '../components/satelliteData';
import {MenuBar} from '../components/MenuBar';

export default function Map(props) {   
    const [userPos, setUserPos] = useState({latitude: undefined, longitude: undefined});
    const [weatherOpacity, setWeatherOpacity] = useState(props.weatherOpacity || 0.5);

    let declinedGeolocation = false;

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos) =>{
                const newUserPos = { 
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                 };
                setUserPos(newUserPos);
           })
        } else {
            declinedGeolocation = true;
        }    
    }, []);


    const markerIconConst = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [35, 50],
    });

    const map = (markerShow, zoomLevel) => {
        return( 
            <MapContainer center={(userPos.latitude && userPos.longitude) ? [userPos.latitude, userPos.longitude] : [45, 10]} zoom={zoomLevel} minZoom={2} style={{ height: '100vh', width: '100%'}} maxBounds={[[-180, -180], [180, 180]]} maxBoundsViscosity={0.75} doubleClickZoom={false}>
                <ScaleControl />
                <TileLayer zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SatelliteData />
                <RainViewerData opacity={weatherOpacity}/>
                <MenuBar weatherOpacity={weatherOpacity} onWeatherOpacityChange={setWeatherOpacity}/>
                {(!markerShow) ? (
                    <Marker icon = {markerIconConst} position={[userPos.latitude, userPos.longitude]}>
                        <Popup>
                            Location: 
                        </Popup> 
                    </Marker>
                ) : (
                    console.log('Marker failed to load.')
                )}
            </MapContainer>
        )
    }

    return(
        <div>
            {
                (userPos.latitude && userPos.longitude) ? 
                    (!declinedGeolocation) ? map(false, 6) : map(true, 3)
                : map(true, 3)
            }
        </div>
    );
}