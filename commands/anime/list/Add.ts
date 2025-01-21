import { readAnimeList, writeAnimeList, PrintAnimeList } from '../../../utils/AnimeUtils.js';
import { Anime } from './Anime.js';
import chalk from 'chalk';

export const AnimeAdd = 
  (
    path: string, 
    name: string, 
    watchingEpisode: number,
    finished: string | boolean = false 
  ) => {
  const animeList = readAnimeList(path);

  const isFinished = typeof finished === 'string' ? finished.toLowerCase() === 'true' : finished;

  const newId = animeList.length > 0 ? Math.max(...animeList.map((anime) => anime.id)) + 1 : 1;

  const newAnime : Anime = {
    id: newId,
    name,
    watchingEpisode,
    finished: isFinished,
  };

  animeList.unshift(newAnime);

  writeAnimeList(path, animeList);
  console.log(chalk.green('Anime added successfully:'));
  PrintAnimeList(newAnime);
};