import { TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

export const SatelliteData = () => {
    const [Bbox, setBbox] = useState();
    const [size, setSize] = useState();

    const map = useMap()

    useEffect(() => {
        setBbox(map.getBounds().toBBoxString());
        setSize(map.getSize());
    }, [map]);

    return (
        <>
            {
                (Bbox !== undefined && size !== undefined) ?
                    <TileLayer 
                    zIndex={2} 
                    opacity={0.1}
                    tileSize={size}
                    url={`https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&height=${size.y}&width=${size.x}&crs=EPSG:4326&format=image/jpeg&access_token=96441f96-86c0-3285-a906-d39abb322f20&bbox=${Bbox}`}
                    /> : <> </>
            }   
        </>
    )
};