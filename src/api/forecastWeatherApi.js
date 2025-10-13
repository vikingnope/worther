import axios from 'axios';

// Keep the API instance private to this module
const forecastApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
    units: 'metric',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Fetches forecast weather data for a specific location
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @param {Function} [setWeather] - Optional state setter for weather data
 * @param {Function} [setLocation] - Optional state setter for location data
 * @param {Function} [setTimes] - Optional state setter for time data
 * @param {Function} [setLoading] - Optional state setter for loading state
 * @returns {Promise<Object>} The processed weather data, location and times
 */
const getForecastWeather = async (lat, lon, setWeather, setLocation, setTimes, setLoading) => {
  try {
    const response = await forecastApi.get('/forecast', {
      params: {
        lat,
        lon,
      },
    });

    // Process all weather data at once instead of updating state in a loop
    const weatherData = response.data.list.map(weatherAPI => ({
      humidity: weatherAPI.main.humidity,
      temperature: weatherAPI.main.temp,
      tempFeel: weatherAPI.main.feels_like,
      pressure: weatherAPI.main.pressure,
      mainWeather: weatherAPI.weather[0].main,
      description: weatherAPI.weather[0].description,
      weatherId: weatherAPI.weather[0].id,
      windSpeed: weatherAPI.wind.speed,
      windDegrees: weatherAPI.wind.deg,
      precipitation: weatherAPI.pop * 100,
      visibility: weatherAPI.visibility,
      dayUNIX: weatherAPI.dt * 1000,
      timeNormalHour: String(new Date(weatherAPI.dt * 1000).getHours()).padStart(2, '0'),
      timeNormalMinutes: String(new Date(weatherAPI.dt * 1000).getMinutes()).padStart(2, '0'),
    }));

    const locationData = {
      name: response.data.city.name,
      country: response.data.city.country,
      lat: response.data.city.coord.lat,
      lon: response.data.city.coord.lon,
      timeZone: response.data.city.timezone,
    };

    const timesData = {
      sunrise: response.data.city.sunrise,
      sunset: response.data.city.sunset,
      timeZone: response.data.city.timezone,
    };

    // Set states if setter functions were provided
    if (setWeather) setWeather(weatherData);
    if (setLocation) setLocation(locationData);
    if (setTimes) setTimes(timesData);
    if (setLoading) setLoading(false);

    // Return the data for direct use
    return {
      weather: weatherData,
      location: locationData,
      times: timesData,
      rawData: response.data,
    };
  } catch (error) {
    console.log(error);
    if (setLoading) setLoading(false);
    throw error; // Re-throw to allow caller to handle the error
  }
};

// Export the function as the default export
export default getForecastWeather;
