import axios from "axios";
import { TileLayer } from 'react-leaflet';
import { useEffect, useState } from "react"

const baseURL = 'https://api.rainviewer.com/public/weather-maps.json';

export const RainViewerData = (props) => {
  const [path, setPath] = useState();

  useEffect(() => {
    getPath();
  }, []);

  async function getPath(){
    await axios.get(baseURL)
      .then(response => {
        const lastPath = response.data.radar.past.length-1;
        setPath(response.data.radar.past[lastPath].path);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <>
      {
        (path !== undefined && props.show) ?
          <TileLayer
            url={`https://tilecache.rainviewer.com${path}/256/{z}/{x}/{y}/2/1_1.png`}
            tileSize={256}
            zIndex = {3}
            opacity = {props.opacity} /> : <></>
      }
    </>
  )
};
