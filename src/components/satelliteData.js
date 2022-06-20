import { TileLayer } from 'react-leaflet';

export const SatelliteData = () => {
    
    return (
        <TileLayer 
            zIndex={2} 
            opacity={0.7} 
            tileSize={1905}
            url={"https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=1920&width=1920&crs=EPSG:4326&format=image/png&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=-77,-77,77,77"}
        />
    )
}