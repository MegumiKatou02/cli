import axios from 'axios';
import * as config from '../constants/config.js'

const apiKey = config.OPENWEATHERMAP_API_KEY

if (!apiKey) {
  throw new Error('OpenWeatherMap API key not found. Please set OPENWEATHERMAP_API_KEY in .env file.');
}

export async function getWeather(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('City not found or unable to fetch weather data.');
  }
}