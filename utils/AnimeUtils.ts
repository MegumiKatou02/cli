import { Anime } from '../commands/anime/list/Anime.js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { truncateString } from './Utils.js';

const readAnimeList = (filePath: string): Anime[] => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }

    const data = fs.readFileSync(path.resolve(filePath), 'utf-8');

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading anime list:', (error as Error).message);
    return [];
  }
};

const writeAnimeList = (filePath: string, animeList: Anime[]): void => {
  try {
    fs.writeFileSync(path.resolve(filePath), JSON.stringify(animeList, null, 2));
  } catch (error) {
    console.error('Error writing anime list:', (error as Error).message);
  }
};

const PrintAnimeList = (animeList: Anime[] | Anime): void => {
  const list = Array.isArray(animeList) ? animeList : [animeList];

  if (list.length === 0) {
    console.log(chalk.yellow('No anime found in the list.'));
    return;
  } 

  const maxIdLength = 4;
  const maxNameLength = 30;
  const maxEpisodeLength = 8;
  const maxStatusLength = 10;

  console.log(
      chalk.bold.blue('ID'.padEnd(maxIdLength)) +
        '  ' +
        chalk.bold.green('Name'.padEnd(maxNameLength)) +
        '  ' +
        chalk.bold.yellow('Episode'.padEnd(maxEpisodeLength)) +
        '  ' +
        chalk.bold.magenta('Status'.padEnd(maxStatusLength))
  );

  list.forEach((anime) => {
      const id = chalk.blue(truncateString(anime.id.toString(), maxIdLength).padEnd(maxIdLength));
      const name = chalk.green(truncateString(anime.name, maxNameLength).padEnd(maxNameLength));
      const episode = chalk.yellow(truncateString(anime.watchingEpisode.toString(), maxEpisodeLength).padEnd(maxEpisodeLength));
      const status = anime.finished ? chalk.green('Finished') : chalk.red('Unfinished');

      console.log(`${id}  ${name}  ${episode}  ${status}`);
  });
}

export { readAnimeList, writeAnimeList, PrintAnimeList };