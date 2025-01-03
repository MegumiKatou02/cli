import { readAnimeList, writeAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeDelete = (path: string, id: string) => {
  let animeList = readAnimeList(path);

  const animeIndex = animeList.findIndex((anime) => anime.id === parseInt(id));

  if (animeIndex !== -1) {
    animeList.splice(animeIndex, 1);

    animeList.forEach((anime, index) => {
      anime.id = index + 1;
    });

    writeAnimeList(path, animeList);
    console.log('Anime deleted successfully');
  } else {
    console.log('Anime not found');
  }
};