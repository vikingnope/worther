import axios from 'axios';

export const getRainViewerData = () => {

    const baseURL = 'https://api.rainviewer.com/public/weather-maps.json';

    axios.get(baseURL);
}