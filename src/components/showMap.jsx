import { MapContainer, TileLayer, Marker, Popup , ScaleControl} from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { RainViewerData }  from '../components/rainViewerData';
// import { SatelliteData } from '../components/satelliteData';
import { MenuBar } from '../components/menuBar';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useParams } from "react-router-dom";
import { WindSpeedLayer } from './windSpeedLayer';
import { TemperatureLayer } from './temperatureLayer';
import { CloudLayer } from './cloudLayer';

export default function ShowMap(props) {   
    const [ userPos, setUserPos ] = useState({latitude: undefined, longitude: undefined});
    const [ layerOpacity, setLayerOpacity ] = useState(props.layerOpacity || 0.7);
    const [ cloudLayerChoice, setCloudLayerChoice ] = useState(false);
    const [ temperatureLayerChoice, setTemperatureLayerChoice ] = useState(false);
    const [ windLayerChoice, setWindLayerChoice ] = useState(false);
    const [ rainLayerChoice, setRainLayerChoice ] = useState(false);

    const { mapType } = useParams();

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
            <div className="text-white">
                <Header choice={'showMap'}/>
                <MapContainer center={(userPos.latitude && userPos.longitude) ? [userPos.latitude, userPos.longitude] : [45, 10]} zoom={zoomLevel} minZoom={2} style={{ height: '100vh', width: '100%'}} maxBounds={[[-180, -180], [180, 180]]} maxBoundsViscosity={0.75} doubleClickZoom={false}>
                    <ScaleControl />
                    <TileLayer zIndex={1}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={(mapType === 'light') ?
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :
                        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"}
                    />
                    {/* <SatelliteData /> */}
                    <RainViewerData show={rainLayerChoice} opacity={layerOpacity} />
                    <WindSpeedLayer show={windLayerChoice} opacity={layerOpacity}/>
                    <TemperatureLayer show={temperatureLayerChoice} opacity={layerOpacity}/>
                    <CloudLayer show={cloudLayerChoice} opacity={layerOpacity}/>
                    <MenuBar showRain={rainLayerChoice} onShowRainChange={setRainLayerChoice} showCloud={cloudLayerChoice} onShowCloudChange={setCloudLayerChoice} showWind={windLayerChoice} onShowWindChange={setWindLayerChoice} showTemperature={temperatureLayerChoice} onShowTemperatureChange={setTemperatureLayerChoice} layerOpacity={layerOpacity} onLayerOpacityChange={setLayerOpacity}/>
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
                 map(false, 6) : map(true, 3)
            }
        </div>
    );
}