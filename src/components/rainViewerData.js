import axios from "axios";
import { TileLayer } from 'react-leaflet';
import {useEffect} from "react"

const baseURL = "https://api.rainviewer.com/public/weather-maps.json";

let url = '';
let path = '';

let fullURL = '';

export const GetRainViewerData = () => {

  useEffect(() => {
    console.log(getURL())
    getURL();
  }, []);

  async function getURL(){
    return await axios.get(baseURL)
      .then(function (response) {
        const lastFrame = response.data.radar.past.length-1;
        url = response.data.host;
        path = response.data.radar.past[lastFrame].path;
        fullURL = url + path + '/8000/2/0_1.png';
        return fullURL;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        return fullURL;
      })
  }

  return (
    console.log(fullURL),
    <TileLayer 
      url = {fullURL}
      opacity={1}
      tileSize = {256}
    />
  )
};
