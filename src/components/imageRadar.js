import axios from "axios";

const baseURL = "https://view.eumetsat.int/geoserver/wms?service=WMS&version=1.3.0&request=GetCapabilities";

let url = '';
let path = '';

let fullURL = '';

export const ImageRadar = () => {

  axios.get(baseURL)
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  

  return fullURL;
};
