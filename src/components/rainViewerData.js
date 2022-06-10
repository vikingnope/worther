import axios from "axios";
import { useEffect, useState } from "react";

const baseURL = "https://api.rainviewer.com/public/weather-maps.json";

let url = '';
let path = '';

export const GetRainViewerData = () => {

  axios.get(baseURL)
  .then(function (response) {
    //console.log(response);
    url = response.data.host;
    path = response.data.radar.past;
    console.log(url);
    console.log(path);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  
};
