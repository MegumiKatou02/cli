import { Command } from 'commander';
import { Anime } from './Anime.js';
import { readAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeFilter = (path: string, finished: boolean, unfinished: boolean) => {
  const animeList = readAnimeList(path);
  let filteredList: Anime[];

  if (finished) {
    filteredList = animeList.filter((anime) => anime.finished);
  } else if (unfinished) {
    filteredList = animeList.filter((anime) => !anime.finished);
  } else {
    filteredList = animeList;
  }

  console.log(filteredList);
}
