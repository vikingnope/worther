import { MapContainer, TileLayer, Marker, Popup , ScaleControl} from 'react-leaflet';
import L from 'leaflet';
import {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import { MenuBar } from '../components/menuBar';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useParams } from "react-router-dom";
import { WindSpeedLayer, TemperatureLayer, CloudLayer, RainViewerData } from './layers';
import { NightRegion } from 'react-leaflet-night-region';
import markerDot from "../resources/location-dot.png";

export default function ShowMap(props) {   
    const [ userPos, setUserPos ] = useState({latitude: undefined, longitude: undefined});
    const [ layerOpacity, setLayerOpacity ] = useState(props.layerOpacity || 0.7);
    const [ cloudLayerChoice, setCloudLayerChoice ] = useState(false);
    const [ temperatureLayerChoice, setTemperatureLayerChoice ] = useState(false);
    const [ windLayerChoice, setWindLayerChoice ] = useState(false);
    const [ rainLayerChoice, setRainLayerChoice ] = useState(false);
    const [ nightLayerChoice, setNightLayerChoice ] = useState(false);

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
        iconUrl: markerDot,
        iconRetinaUrl: markerDot,
        iconAnchor: [13, 14],
        popupAnchor: [0, -13],
        iconSize: [26.5, 28]
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
                    {
                    (nightLayerChoice) ?
                        <NightRegion
                            fillColor='#000000'
                            refreshInterval={1000}
                            weight='0'
                        /> :
                        <></>
                    }
                    <RainViewerData show={rainLayerChoice} opacity={layerOpacity} />
                    <WindSpeedLayer show={windLayerChoice} opacity={layerOpacity}/>
                    <TemperatureLayer show={temperatureLayerChoice} opacity={layerOpacity}/>
                    <CloudLayer show={cloudLayerChoice} opacity={layerOpacity}/>
                    <MenuBar mode={mapType} showNight={nightLayerChoice} onShowNightChange={setNightLayerChoice} showRain={rainLayerChoice} onShowRainChange={setRainLayerChoice} showCloud={cloudLayerChoice} onShowCloudChange={setCloudLayerChoice} showWind={windLayerChoice} onShowWindChange={setWindLayerChoice} showTemperature={temperatureLayerChoice} onShowTemperatureChange={setTemperatureLayerChoice} layerOpacity={layerOpacity} onLayerOpacityChange={setLayerOpacity}/>
                    {(!markerShow) ? (
                        <Marker icon = {markerIconConst} position={[userPos.latitude, userPos.longitude]}>
                            <Popup>
                                <a id='markerText' className='font-bold text-sm underline text-black' href={'/weatherLocation/' + userPos.latitude + '/' + userPos.longitude}>Get weather of location</a>
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