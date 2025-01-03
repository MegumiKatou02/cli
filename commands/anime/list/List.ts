import { readAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeList = (path: string) => {
    const animeList = readAnimeList(path);
    console.log(animeList);
}