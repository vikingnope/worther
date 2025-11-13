import axios from 'axios';

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
    units: 'metric',
  },
  timeout: 10000, // 10 seconds timeout
});

export const getCurrentWeather = async (
  { city, countryCode, latitude, longitude },
  { setWeather, setLocation, setTimes, setLoaded, setLoading }
) => {
  try {
    // Determine params based on inputs
    let params = {};
    if (latitude !== undefined && longitude !== undefined) {
      params = { lat: latitude, lon: longitude };
    } else if (city) {
      params.q = countryCode ? `${city},${countryCode}` : city;
    }

    const response = await weatherApi.get('/weather', { params });

    const weatherObj = {
      humidity: response.data.main.humidity,
      temperature: response.data.main.temp,
      tempMax: response.data.main.temp_max,
      tempMin: response.data.main.temp_min,
      tempFeel: response.data.main.feels_like,
      pressure: response.data.main.pressure,
      mainWeather: response.data.weather[0].main,
      description: response.data.weather[0].description,
      weatherId: response.data.weather[0].id,
      windSpeed: response.data.wind.speed,
      windDegrees: response.data.wind.deg,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
      visibility: response.data.visibility,
      rain: response.data.rain !== undefined ? response.data.rain['1h'] : undefined,
      timeUpdatedUNIX: response.data.dt,
      timeZone: response.data.timezone,
    };
    setWeather(weatherObj);

    const locationObj = {
      name: response.data.name,
      lat: response.data.coord.lat,
      lon: response.data.coord.lon,
      country: response.data.sys.country,
    };
    setLocation(locationObj);

    const timesObj = {
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
      timeZone: response.data.timezone,
    };
    setTimes(timesObj);

    setLoaded(true);
    setLoading(false);
  } catch (error) {
    const errorState = {
      loaded: false,
      blocked: error.response?.status === 429,
      connectionError: error.response?.data?.code === 'ERR_NETWORK',
    };
    // Handle the error (you'll need to add this part)
  }
};
