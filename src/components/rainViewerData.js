import axios from 'axios';
import { useEffect } from 'react';

const baseURL = 'https://api.rainviewer.com/public/weather-maps.json';

export const GetRainViewerData = () => {
    useEffect(() => {
        axios.get(baseURL).then(response => {
            console.log(response.data)
        })
    })
}