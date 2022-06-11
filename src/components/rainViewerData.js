import axios from "axios";

const baseURL = "https://api.rainviewer.com/public/weather-maps.json";

let url = '';
let path = '';

let fullURL = '';

export const GetRainViewerData = () => {

  axios.get(baseURL)
  .then(function (response) {
    const lastFrame = response.data.radar.past.length-1;
    url = response.data.host;
    path = response.data.radar.past[lastFrame].path;
    fullURL = url + path + '/8000/2/0_1.png';
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  

  return fullURL;
};
