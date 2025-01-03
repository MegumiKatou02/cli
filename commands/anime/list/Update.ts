import { readAnimeList, writeAnimeList } from '../../../utils/AnimeUtils.js';

export const AnimeUpdate = (path: string, id: string, episode?: string, finished?: boolean) => {
  let animeList = readAnimeList(path);
  const animeIndex = animeList.findIndex(
    (anime) => anime.id === parseInt(id)
  );

  if (animeIndex !== -1) {
    if(episode !== undefined) {
      animeList[animeIndex].watchingEpisode = parseInt(episode);
    }

    if (finished !== undefined) {
      animeList[animeIndex].finished = finished;
    }

    animeList.unshift(animeList.splice(animeIndex, 1)[0]);

    writeAnimeList(path, animeList);
    
    console.log('Anime updated successfully');
  } else {
    console.log('Anime not found');
  }
}