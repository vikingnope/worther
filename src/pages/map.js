import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css';
import  { GetRainViewerData }  from '../components/rainViewerData';

//const RainViewerData = GetRainViewerData().then((data) => {console.log(data)});

export default class Map extends Component {
    state = {
        longitude: 14,
        latitude: 35,
        //rainViewerURL: GetRainViewerData()
    };

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    latitude: position.coords.latitude, 
                    longitude: position.coords.longitude
                }, () => {
                    console.log(this.state.longitude);
                    console.log(this.state.latitude);
                })
            });
        }
        //setInterval(GetRainViewerData(), 2000);
    }

    render () {
        const markerIconConst = L.icon({
            iconUrl: markerIcon,
            iconRetinaUrl: markerIcon,
            iconAnchor: [5, 55],
            popupAnchor: [10, -44],
            iconSize: [35, 50],
        });
        
        return(
            <MapContainer center={[this.state.latitude, this.state.longitude]} zoom={6} minZoom={3} style={{ height: '100vh', width: '100%'}}>
                <TileLayer zIndex={1}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TileLayer zIndex={2} opacity={0.1}
                    url={"https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=1080&width=1920&crs=EPSG:4326&format=image/png&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=-180,-89,180,89"}
                />
                <TileLayer zIndex={3} opacity={1}
                    url = {''}
                />
                {this.state.latitude !== 45 && this.state.longitude !== 10 ? (
                    <Marker icon = {markerIconConst} position={[this.state.latitude, this.state.longitude]}>
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
}