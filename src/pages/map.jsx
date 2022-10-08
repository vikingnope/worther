import { MapContainer, TileLayer, Marker, Popup , ScaleControl} from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { RainViewerData }  from '../components/rainViewerData';
// import { SatelliteData } from '../components/satelliteData';
import { MenuBar } from '../components/MenuBar';
import { Options } from '../components/options';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function Map(props) {   
    const [userPos, setUserPos] = useState({latitude: undefined, longitude: undefined});
    const [weatherOpacity, setWeatherOpacity] = useState(props.weatherOpacity || 0.7);

    let declinedGeolocation = false;

    document.title = "Worther - Map";

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
            <div>
                <Header choice={'map'}/>
                <MapContainer center={(userPos.latitude && userPos.longitude) ? [userPos.latitude, userPos.longitude] : [45, 10]} zoom={zoomLevel} minZoom={2} style={{ height: '100vh', width: '100%'}} maxBounds={[[-180, -180], [180, 180]]} maxBoundsViscosity={0.75} doubleClickZoom={false}>
                    <ScaleControl />
                    {/* For dark mode map: https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png */}
                    <TileLayer zIndex={1}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <SatelliteData /> */}
                    <RainViewerData opacity={weatherOpacity}/>
                    <MenuBar weatherOpacity={weatherOpacity} onWeatherOpacityChange={setWeatherOpacity}/>
                    <Options/>
                    {(!markerShow) ? (
                        <Marker icon = {markerIconConst} position={[userPos.latitude, userPos.longitude]}>
                            <Popup>
                                Location: 
                            </Popup> 
                        </Marker>
                    ) : (
                        <></>
                    )}
                </MapContainer>
                <Footer/>
            </div>
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