import { Anime } from '../commands/anime/list/Anime.js';
import fs from 'fs';
import path from 'path';

const readAnimeList = (filePath: string): Anime[] => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }

    const data = fs.readFileSync(path.resolve(filePath), 'utf-8');

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading anime list:', (error as Error).message);
    return [];
  }
};

const writeAnimeList = (filePath: string, animeList: Anime[]): void => {
  try {
    fs.writeFileSync(path.resolve(filePath), JSON.stringify(animeList, null, 2));
  } catch (error) {
    console.error('Error writing anime list:', (error as Error).message);
  }
};

export { readAnimeList, writeAnimeList };