import { readAnimeList, writeAnimeList } from '../../../utils/AnimeUtils.js';
import chalk from 'chalk';

export const AnimeUpdate = (path: string, id: string, episode?: string, finished?: boolean) => {
  let animeList = readAnimeList(path);

  if(id === "start" || id === "s") {
    id = "1";
  }
  else if(id === "end" || id === "e") {
    let maxId: number = Math.max(...animeList.map((anime) => anime.id));
    id = maxId.toString();    
  }

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
    
    console.log(chalk.green('Anime updated successfully'));
  } else {
    console.log(chalk.red('Anime not found'));
  }
}