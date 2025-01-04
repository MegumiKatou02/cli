import { Command } from "commander";
import * as manga from './Manga.js';
import chalk from 'chalk';
import { TruyenDexImageDownloader } from '../../public/manga/MangaDexAPI.js';

const mangaCommand = new Command("manga")
    .description('manga')

mangaCommand
    .command('download')
    .description('Download manga')
    .requiredOption('-u, --url <url>', 'URL of the manga to download')
    .option('-p, --platform <platform>', 'Platform to download from (MangaDex or TruyenDex)', 'MangaDex')
    .option('-c, --chapters <chapters>', 'Specific chapters to download (e.g., 1,2,3 or 1-5)')
    .action(async (options) => {
        try {
            const downloader = new TruyenDexImageDownloader((message) => console.log(message));
            downloader.setupTitle(options.platform);
            await downloader.downloadManga(options.url, options.chapters);
        } catch (error) {
            console.log(chalk.red(`Error: ${(error as Error).message}`));
        }
    });

mangaCommand
    .command('search')
    .description('Search for manga')
    .option('-n, --name <title>', 'Search for manga by title')
    .option('-i, --include <tags>', 'Include manga with specific tags (comma-separated)')
    .option('-e, --exclude <tags>', 'Exclude manga with specific tags (comma-separated)')
    .option('-l, --limit <number>', 'Limit the number of results displayed', parseInt) 
    .action(async (options) => {
        try {
            if(options.include || options.exclude) {
                const includedTags = options.include
                    ? await manga.getTagIDs(options.include.split(','))
                        : undefined;
                
                const excludedTags = options.exclude
                    ? await manga.getTagIDs(options.exclude.split(','))
                        : undefined;
                
                const results = await manga.searchManga({
                    title: options.title,
                    includedTags,
                    excludedTags,
                });
                
                let limit: number = (options.limit <= 0 ? 1 : options.limit) || results.length;
        
                manga.displayMangaResults(results.slice(0, limit));
            }
            else if(options.name) {
                const results = await manga.searchOnlyManga(options.name);
                const limit = (options.limit <= 0 ? 1 : options.limit) || results.length;
                manga.displayMangaResults(results.slice(0, limit));
            }
            else {
                console.log('Please provide a search term');
            }
        } catch (error) {
            console.log(chalk.red(`Error: ${(error as Error).message}`));
        }
    });
    
export { mangaCommand };