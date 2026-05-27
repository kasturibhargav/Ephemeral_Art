import axios from 'axios';

const LAT = 47.3769; // Zurich
const LON = 8.5417;

export const fetchWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m`
    );
    
    return {
      temperature: response.data.current.temperature_2m,
      windSpeed: response.data.current.wind_speed_10m,
      windDirection: response.data.current.wind_direction_10m,
      humidity: response.data.current.relative_humidity_2m,
      time: response.data.current.time,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    // Return fallback data if API fails so the art still renders
    return {
      temperature: 15,
      windSpeed: 10,
      windDirection: 180,
      humidity: 50,
      time: new Date().toISOString(),
    };
  }
};
