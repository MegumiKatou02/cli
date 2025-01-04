import { readAnimeList, PrintAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeList = (path: string) => {
    const animeList = readAnimeList(path);

    PrintAnimeList(animeList);
}