import axios from 'axios';

export const getRainViewerData = () => {

    const baseURL = 'https://api.rainviewer.com/public/weather-maps.json';

    const data = axios.get(baseURL);

    console.log(data)

    return(
        console.log(data)
    )
}