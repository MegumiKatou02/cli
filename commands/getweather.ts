import { getWeather } from '../services/WeatherService.js';

export const getWeatherCommand = {
  command: 'weather',
  description: 'Get current weather for a city',
  options: [
    { flag: '--city <city>', description: 'City name to get weather for' }
  ],
  action: async (options: { city: string }) => {
    if (!options.city) {
      console.error('Please provide a city name with --city');
      return;
    }
    try {
      const weatherData = await getWeather(options.city);
      console.log(`Weather in ${weatherData.name}:`);
      console.log(`Temperature: ${weatherData.main.temp}°C`);
      console.log(`Condition: ${weatherData.weather[0].description}`);
      console.log(`Humidity: ${weatherData.main.humidity}%`);
    } catch (error) {
      console.error('Error fetching weather data:', (error as Error).message);
    }
  }
};