import { Anime } from './Anime.js';
import { readAnimeList, PrintAnimeList } from '../../../utils/AnimeUtils.js';
import chalk from 'chalk';

export const AnimeSearch = (path: string, name: string, id: string) => {

    const animeList = readAnimeList(path);
    let result: Anime | Anime[] | undefined;

    if (name) {
      result = animeList.filter((anime) =>
        anime.name.toLowerCase().includes(name.toLowerCase())
      );
    } else if (id) {
      if(id === "start" || id === "s") {
        result = animeList.find((anime) => anime.id === 1);
      }
      else if(id === "end" || id === "e") {
        let maxId = Math.max(...animeList.map((anime) => anime.id));
        result = animeList.find((anime) => anime.id === maxId);
      }
      else {
        result = animeList.find((anime) => anime.id === parseInt(id));
      }
    }

    if(result === undefined) {
      console.log(chalk.red("Anime not found"));
    }
    else {
      PrintAnimeList(result);
    }
}