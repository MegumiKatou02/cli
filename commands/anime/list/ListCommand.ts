import { AnimeFilter } from './Filter.js'
import { AnimeSearch } from './Search.js'
import { AnimeList } from './List.js'
import { AnimeUpdate } from './Update.js'
import { AnimeAdd } from './Add.js'
import { AnimeDelete } from './Delete.js'

import { Command } from 'commander';

const checkPath = (path: string): string => {
  if(path.trim() === '.') {
    return process.cwd() + '/anime.json';
  }
  return path;
}

const animeManager = new Command('anime-manager')
  .description('Manage your anime list')
  .requiredOption('-f, --file <file>', 'Path to anime.json');

animeManager
  .command('list')
  .description('List all anime')
  .action(() => {
    const parentOptions = animeManager.opts();
    AnimeList(checkPath(parentOptions.file));
  });

animeManager
  .command('filter')
  .description('Filter anime list by status')
  .option('--finished', 'Filter finished anime')
  .option('--unfinished', 'Filter unfinished anime')
  .action((options, command) => {
    const parentOptions = command.parent.opts();
    AnimeFilter(checkPath(parentOptions.file), options.finished, options.unfinished);
  });

animeManager
  .command('search')
  .description('Search anime by name or id')
  .option('--name <name>', 'Search by name')
  .option('--id <id>', 'Search by id')
  .action((options, command) => {
    const parentOptions = command.parent.opts();
    AnimeSearch(checkPath(parentOptions.file), options.name, options.id);
  });

animeManager
  .command('update')
  .description('Update the episode or status of an anime')
  .requiredOption('--id <id>', 'ID of the anime to update')
  .option('--episode <episode>', 'Episode number')
  .option('--finished <finished>', 'Mark anime as finished (true/false)')
  .action((options, command) => {
    const parentOptions = command.parent.opts();
    AnimeUpdate(checkPath(parentOptions.file), options.id, options.episode, options.finished);
  });

  animeManager
  .command('add')
  .description('Add a new anime to the list')
  .requiredOption('--name <name>', 'Name of the anime')
  .requiredOption('--episode <episode>', 'Current watching episode')
  .option('--finished <finished>', 'Mark anime as finished (true/false)', 'false')
  .action((options, command) => {
    const parentOptions = command.parent.opts();
    AnimeAdd(checkPath(parentOptions.file), options.name, options.episode, options.finished);
  });

animeManager
  .command('delete')
  .description('Delete an anime from the list')
  .requiredOption('--id <id>', 'ID of the anime to delete')
  .action((options, command) => {
    const parentOptions = command.parent.opts();
    AnimeDelete(checkPath(parentOptions.file), options.id);
  });

export { animeManager };