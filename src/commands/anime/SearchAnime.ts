import axios from 'axios';
import chalk from 'chalk';
import * as URLs from '../../constants/URLs.js';

const API_URL = URLs.API_URL_ANILIST;

const SEARCH_ANIME_QUERY = `
  query ($title: String) {
    Media(search: $title, type: ANIME) {
      title {
        english
        romaji
      }
      description
      episodes
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
    }
  }
`;

export async function searchAnime(title: string) {
    try {
      const response = await axios.post(API_URL, {
        query: SEARCH_ANIME_QUERY,
        variables: { title },
      });
  
      const anime = response.data.data.Media;
      if (!anime) {
        console.log(chalk.red('No anime found.'));
        return;
      }
  
      console.log(chalk.blue.bold(`Title: ${anime.title.english || anime.title.romaji}`));
    //   console.log(chalk.blue.bold('Description:'));s
    //   console.log(anime.description || 'No description available.');
      console.log(chalk.blue.bold(`Episodes: ${anime.episodes || 'Unknown'}`));
      console.log(chalk.blue.bold(`Status: ${anime.status}`));
      console.log(chalk.blue.bold(`Start Date: ${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}`));
      console.log(chalk.blue.bold(`End Date: ${anime.endDate.year}-${anime.endDate.month}-${anime.endDate.day || 'Ongoing'}`));
    } catch (error) {
      console.error(chalk.red('Error fetching anime data:'), (error as Error).message);
    }
  }