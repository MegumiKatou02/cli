import { readAnimeList, writeAnimeList } from '../../../utils/AnimeUtils.js';
import chalk from 'chalk';

export const AnimeDelete = (path: string, id: string) => {
  let animeList = readAnimeList(path);

  if(id === "start" || id === "s") {
    id = "1";
  }
  else if(id === "end" || id === "e") {
    let maxId: number = Math.max(...animeList.map((anime) => anime.id));
    id = maxId.toString();
  }

  const animeIndex = animeList.findIndex((anime) => anime.id === parseInt(id));

  if (animeIndex !== -1) {
    animeList.splice(animeIndex, 1);

    animeList.forEach((anime, index) => {
      anime.id = index + 1;
    });

    writeAnimeList(path, animeList);
    console.log(chalk.green('Anime deleted successfully'));
  } else {
    console.log(chalk.red('Anime not found'));
  }
};