import chalk from 'chalk';
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

      const getTemperatureColor = (temp: number) => {
        if (temp >= 30) return chalk.red(temp);
        if (temp <= 10) return chalk.blue(temp);
        return chalk.green(temp);
      };

      const supportsEmoji = 
        process.env.TERM_PROGRAM === 'vscode' || 
        process.platform === 'darwin' || 
        process.platform === 'linux';

      const getTemperatureSymbol = (temp: number) => {
        if (temp > 30) return supportsEmoji ? '🔥' : '*'; 
        if (temp < 10) return supportsEmoji ? '❄️' : '~'; 
        return supportsEmoji ? '🌤️' : '~';
      };

      console.log(`${chalk.yellow(`Weather in`)} ${chalk.green(weatherData.name)}:`);
      console.log(`Temperature: ${getTemperatureColor(weatherData.main.temp)}°C ${getTemperatureSymbol(weatherData.main.temp)}`);
      console.log(`Condition: ${chalk.cyan(weatherData.weather[0].description)}`);
      console.log(`Humidity: ${chalk.cyan(weatherData.main.humidity)}%`);
      console.log(`Wind Speed: ${chalk.cyan(weatherData.wind.speed)} ${chalk.white(`m/s`)}`);
    } catch (error) {
      console.error('Error fetching weather data:', (error as Error).message);
    }
  }
};