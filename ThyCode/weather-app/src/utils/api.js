import axios from "axios";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const fetchWeatherData = async (city = null, lat = null, lon = null) => {
  try {
    const response = await axios.get(`${BASE_URL}weather`, {
      params: {
        q: city || undefined,
        lat: lat || undefined,
        lon: lon || undefined,
        units: "metric",
        appid: API_KEY,
      },
    });

    const forecastResponse = await axios.get(`${BASE_URL}forecast`, {
      params: {
        q: city || undefined,
        lat: lat || undefined,
        lon: lon || undefined,
        units: "metric",
        appid: API_KEY,
      },
    });

    console.log("Full Forecast API Response:", forecastResponse.data); //  Debugging

    return {
      current: response.data,
      hourly: forecastResponse.data.list || [],
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return { current: null, hourly: [] }; 
  }
};
