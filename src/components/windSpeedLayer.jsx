import { TileLayer } from 'react-leaflet';

export const WindSpeedLayer = (props) => {

  return (
    <>
    {
      (props.show) ?
        <TileLayer
        url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=45245b26fa062bdd9ca60efac28d1c01`}
        tileSize={256}
        zIndex = {3}
        opacity = {props.opacity} 
        /> :
        <></>
    }
    </>
  )
};
