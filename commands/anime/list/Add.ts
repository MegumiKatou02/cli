import { readAnimeList, writeAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeAdd = (
    path: string,
    name: string,
    watchingEpisode: number,
    finished: boolean = false
  ) => {
    const animeList = readAnimeList(path);
  
    const newId = animeList.length > 0 ? Math.max(...animeList.map((anime) => anime.id)) + 1 : 1;
  
    const newAnime = {
      id: newId,
      name,
      watchingEpisode,
      finished,
    };
  
    animeList.unshift(newAnime);
  
    writeAnimeList(path, animeList);
    console.log('Anime added successfully:', newAnime);
  };