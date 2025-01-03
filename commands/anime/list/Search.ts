import { Command } from 'commander';
import { Anime } from './Anime.js';
import { readAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeSearch = (path: string, name: string, id: string) => {

    const animeList = readAnimeList(path);
    let result: Anime | Anime[] | undefined;

    if (name) {
      result = animeList.filter((anime) =>
        anime.name.toLowerCase().includes(name.toLowerCase())
      );
    } else if (id) {
      result = animeList.find((anime) => anime.id === parseInt(id));
    }

    if(result === undefined) {
      console.log("Anime not found");
    }
    else console.log(result);
}