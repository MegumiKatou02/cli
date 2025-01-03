#!/usr/bin/env node

import fs, { promises as profs } from 'fs'
import path from 'path';
import chalk from 'chalk';
import { Command } from 'commander';
import { showVersion } from '../commands/Version.js';
import { qrCommand } from '../commands/QR.js'; 
import { welcome } from '../commands/Info.js';
import { OptionPassword } from '../commands/Password.js'
import { VERSION } from '../constants/Version.js';
import { countFilesAndFoldersShallow } from '../commands/files/Countfiles.js'
import { countFilesAndFoldersDeep } from '../commands/files/Countfilesdeep.js'
import { getWeatherCommand } from '../commands/Getweather.js'
import { monitorSystemCommand } from '../commands/system/MonitorSystem.js';
import { convertImageCommand } from '../commands/image/ConvertImage.js'
import { resizeImagesCommand } from '../commands/image/ImageResize.js'
import { readFile, saveFile } from "../utils/FileProcess.js";
import { editFile } from "../commands/files/EditFile.js";
import readlineSync from "readline-sync";
import packageJson from 'package-json';
import { execSync } from 'child_process';
import { listProcesses } from '../commands/system/ListProccesses.js';
import { killProcess } from '../commands/system/KillProcess.js';
import { monitorProcess } from '../utils/ProcessUtils.js';
import { handleFindProcess } from '../commands/system/FindProcess.js'
import { getNetworkInfo } from '../commands/system/NetworkInfo.js'
import { encryptFile } from '../commands/code/Encrypt.js';
import { decryptFile } from '../commands/code/Decrypt.js';
import { ListBookMarks } from '../commands/bookmarks/ListBookmarks.js'
import { AddBookMarks } from '../commands/bookmarks/AddBookmarks.js'
import { searchCharacter } from '../commands/anime/SearchCharacter.js'
import { searchAnime } from '../commands/anime/SearchAnime.js'
import { createGIF } from '../commands/image/CreateGif.js'
import * as git from '../commands/git/Git.js'
import { TruyenDexImageDownloader } from '../public/manga/MangaDexAPI.js'
import { LightNovelDownloader } from '../public/lightnovel/LightNovel.js'
import * as themes from '../commands/Theme.js'
import * as manga from '../commands/manga/Manga.js'
import { convertToPdfCommand } from '../commands/convert/ConvertToPdf.js'
import { animeManager } from '../commands/anime/list/ListCommand.js'

const program = new Command();

program
  .name('haiku')
  .description('A custom CLI tool for special tasks')
  .version(`${VERSION}`, '-v, --version', 'Show current version of Haiku CLI');

program.addCommand(animeManager);

program
  .command('manga')
  .description('manga')
  .option('-u, --url <url>', 'URL of the manga to download')
  .option('-p, --platform <platform>', 'Platform to download from (MangaDex or TruyenDex)', 'MangaDex')
  .option('-s --search <name>', 'Search a manga')
  .option('-i, --include-tags <tags>', 'Include manga with specific tags (comma-separated)')
  .option('-e, --exclude-tags <tags>', 'Exclude manga with specific tags (comma-separated)')
  .option('-l, --limit <number>', 'Limit the number of results displayed', parseInt) 
  .action(async (options) => {
    try {
      console.log(options);
      if (!options.url && !options.search && !options.includeTags && !options.excludeTags) {
        console.log(chalk.yellow('Please provide at least one option.'));
        console.log(chalk.whiteBright('Usage:'));
        console.log(chalk.whiteBright(`  --url with --platform`));
        console.log(chalk.whiteBright(`  --search with --limit`));
        console.log(chalk.whiteBright(`  --include-tags with --exclude-tags with --limit`));
        return;
      }

      if(options.url) {
        const downloader = new TruyenDexImageDownloader((message) => console.log(message));
        downloader.setupTitle(options.platform);
        await downloader.downloadManga(options.url);
      }
      else if(options.search) {
        const results = await manga.searchOnlyManga(options.search);
        const limit = options.limit || results.length; 
        manga.displayMangaResults(results.slice(0, limit));
      }
      else if(options.includeTags || options.excludeTags) {
        const includedTags = options.includeTags
                ? await manga.getTagIDs(options.includeTags.split(','))
                : undefined;

        const excludedTags = options.excludeTags
            ? await manga.getTagIDs(options.excludeTags.split(','))
            : undefined;

        const results = await manga.searchManga({
          title: options.title,
          includedTags,
          excludedTags,
        });

        const limit = options.limit || results.length; 
        manga.displayMangaResults(results.slice(0, limit));
      }
      else {
        console.log(chalk.whiteBright('Usage:'));
        console.log(chalk.whiteBright(`  --url with --platform`));
        console.log(chalk.whiteBright(`  --search with --limit`));
        console.log(chalk.whiteBright(`  --include-tags with --exclude-tags with --limit`));
      }
    } catch(error) {
      console.error('Error:', (error as Error).message);
    }
  });

program
  .command('ln')
  .description('Download light novels to txt files')
  .requiredOption('-u, --url <url>', 'URL of the light novel to download')
  .option('-d, --domain <domain>', 'Domain to download from (default: ln.hako.vn)', 'ln.hako.vn')
  .action(async (options) => {
      const downloader = new LightNovelDownloader((message) => console.log(message));
      downloader.setupDomain(options.domain);
      await downloader.downloadLightNovel(options.url);
  });

program
  .command('create-gif <inputFolder> <outputFile>')
  .description('Create a GIF from multiple images in a folder')
  .option('-d --delay <number>', 'Delay between frames in milliseconds', '100')
  .option('-w --width <number>', 'Width of the GIF', '500')
  .option('-h --height <number>', 'Height of the GIF', '500')
  .action(async (inputFolder, outputFile, options) => {
    try {
      await createGIF(inputFolder, outputFile, {
        delay: parseInt(options.delay),
        width: parseInt(options.width),
        height: parseInt(options.height),
      });
    } catch (error) {
      console.error('Error creating GIF:', (error as Error).message);
    } 
  });

program
  .command('anime')
  .option('-c, --character <name>', 'Search for an anime character')
  .option('-a, --anime <title>', 'Search for an anime by title')
  .description('Search for anime characters or shows')
  .action((options) => {
    try {
      if (options.character) {
        searchCharacter(options.character);
      } else if (options.anime) {
        searchAnime(options.anime);
      } else {
        console.log(chalk.yellow('Please provide a character name using --character or an anime title using --anime.'));
      }
    } catch (error) {
      console.error('Error searching:', (error as Error).message);
    }
  });

program
  .command('theme')
  .description('Configure themes for the CLI')
  .option('--init', 'Initialize the themes directory')
  .option('-i --install <themeName>', 'Install a theme')
  .option('-l --list', 'List all installed themes')
  .option('-a --apply <themeName>', 'Apply a theme')
  .option('-d --delete <themeName>', 'Delete a theme')
  .action((options, themeName) => {
    try {
      if(options.init) {
        themes.initThemesDir();
      }
      if(options.install) {
        themes.installTheme(themeName);
      }
      if(options.list) {
        themes.listThemes();
      }
      if(options.apply) {
        themes.applyTheme(themeName);
      }
      if(options.delete) {
        themes.deleteTheme(themeName);
      }
    } catch(error) {
      console.error('Error:', (error as Error).message);
    }
  });

program
  .command('add <name> <url>')
  .description('Add a new bookmark')
  .action(async (name, url) => {
    try {
      await AddBookMarks(name, url);
    } catch (error) {
      console.error('Error adding bookmark:', (error as Error).message);
    }
  });

program
  .command('encrypt <inputFile> <outputFile>')
  .description('Encrypt a file')
  .action((inputFile: string, outputFile: string) => {
    encryptFile(inputFile, outputFile);
  });

program
  .command('decrypt <inputFile> <outputFile>')
  .description('Decrypt a file')
  .action((inputFile: string, outputFile: string) => {
    decryptFile(inputFile, outputFile);
  });

program
  .command('myip')
  .description('Show your IP')
  .action(() => {
    const info = getNetworkInfo();
    info.forEach((iface) => {
      console.log(`Interface: ${iface.interface}`);
      console.log(`IP Address: ${iface.ip}`);
      console.log('-------------------------');
    });
  });

program
  .command('list')
  .option('-p, --processes', 'List all running processes')
  .option('-b, --bookmarks', 'List all bookmarks')
  .description('List all running processes')
  .action(async (options) => {
    try {
      if(options.processes) {
        await listProcesses();
      }
      if(options.bookmarks) {
        await ListBookMarks();
      }
      if (!options.processes && !options.bookmarks) {
        program.help();
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  });

program
  .command('kill <pid>')
  .description('Kill a process by PID')
  .action((pid: string) => {
      killProcess(parseInt(pid));
  });

program
  .command('monitor <pid>')
  .description('Monitor a process by PID')
  .action((pid: string) => {
      monitorProcess(parseInt(pid));
  });

  program
  .command('find <name>')
  .description('Find processes by name')
  .option('-e, --exact', 'Exact match')
  .option('-l, --limit <number>', 'Limit the number of results', parseInt)
  .action((name: string, options: { exact?: boolean; limit?: number }) => {
      handleFindProcess(name, options.exact, options.limit);
  });

program
  .command('resize <input> <output>')
  .description('Resize an image and adjust its quality.')
  .option('-w, --width <number>', 'Target width in pixels')
  .option('-h, --height <number>', 'Target height in pixels')
  .option('-q, --quality <number>', 'Output quality (0-100)', '75')
  .action(async (input: string, output: string, options: { width?: string; height?: string; quality?: string }) => {
    try {
      await resizeImagesCommand(input, output, options);
    } catch (error) {
      console.log((error as Error).message)
    }
  });

program.addCommand(convertImageCommand);

program.addCommand(convertToPdfCommand);

program
  .command(getWeatherCommand.command) // thu cach viet moi :3
  .description(getWeatherCommand.description)
  .option(getWeatherCommand.options[0].flag, getWeatherCommand.options[0].description)
  .action(getWeatherCommand.action);

program
  .command(monitorSystemCommand.command)
  .description(monitorSystemCommand.description)
  .action(monitorSystemCommand.action);

program
  .command('qr')
  .description('Generate QR code from text or URL')
  .action(() => {
    qrCommand();
  });  

program
  .command('version')
  .description('Show version of CLI')
  .action(() => {
    showVersion();
  });

program
  .command('info')
  .description('')
  .action(() => {
    welcome();
  })

program
  .command('password')
  .description('Generate random password with options')
  .action(async () => {
    try {
      await OptionPassword();
    } catch (error) {
      console.log((error as Error).message)
    }
  })

program
  .command("count <path>")
  .option("-d --deep", "Recursively count files and folders in subdirectories")
  .description("Count files and folders in a directory")
  .action(async (path, options) => {
    try {
      if (options.d) {
        await countFilesAndFoldersDeep(path);
      } else {
        await countFilesAndFoldersShallow(path);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });

program
  .command("edit")
  .description("edit file")
  .action(async () => {
    try {
      const filePath = readlineSync.question("Enter file path: ");
      const content = await readFile(filePath);
      
      console.log("=== File content ===");
      content.forEach((line, index) => {
        console.log(`${index + 1}: ${line}`);
      });
  
      const updatedContent = await editFile(content);
      await saveFile(filePath, updatedContent);  
    } catch (error) {
      console.log((error as Error).message)
    }
  });

program
  .command('clone <repoUrl>')
  .description('Clone a GitHub repository into the current directory')
  .option('-g --git', 'use git')
  .action(async (repoUrl, options) => {
    if(!options.git) {
      console.error('Please provide a git flag with -g or --git');
      return;
    }
    await git.Clone(repoUrl);
  });

const branch = git.Branch;

program
  .command(branch.command)
  .description(branch.description)
  .option(branch.options[0].flag, branch.options[0].description)
  .option(branch.options[1].flag, branch.options[1].description)
  .option(branch.options[2].flag, branch.options[2].description) // flag git :v
  .action(branch.action);

program
  .command('push')
  .description('Push changes to the remote Git repository')
  .option('-g --git', 'use git')
  .action(async (options) => {
    if(!options.git) {
      console.error('Please provide a git flag with -g or --git');
      return;
    }
    await git.Push();
});

program
  .command('pull')
  .description('Pull changes from the remote Git repository')
  .option('-g --git', 'use git')
  .action(async (options) => {
    if(!options.git) {
      console.error('Please provide a git flag with -g or --git');
      return;
    }
    await git.Pull();
});

program
  .command('log')
  .description('Show the commit history of the Git repository')
  .option('-g --git', 'use git')
  .action(async (options) => {
    if(!options.git) {
      console.error('Please provide a git flag with -g or --git');
      return;
    }
    await git.Log();
  });

program
  .command('status')
  .description('Show the working tree status')
  .option('-g --git', 'use git')
  .action(async (options) => {
    if(!options.git) {
      console.error('Please provide a git flag with -g or --git');
      return;
    }
    await git.Status();
  });

  program
  .command('search')
  .description('Search for files or directories matching the query or extension')
  .option('-d, --dir <directory>', 'Specify the directory to search in', '.')
  .option('-e, --extension <ext>', 'Search for files with a specific extension')
  .option('-q, --query <query>', 'Search for files or directories matching the query')
  .action(async (options) => {
    try {
      const searchDir = options.dir;
      const extension = options.extension;
      const query = options.query;

      console.log(`Searching in ${searchDir}...`);
      if (extension) console.log(`Filtering by extension .${extension}`);
      if (query) console.log(`Filtering by query "${query}"`);

      const files = await profs.readdir(searchDir, { withFileTypes: true });
      const results = files.filter(file => {
        const matchesQuery = query ? file.name.includes(query) : true;
        const matchesExtension = extension ? file.name.endsWith(`.${extension}`) : true;
        return matchesQuery && matchesExtension;
      });

      if (results.length > 0) {
        results.forEach(file => {
          console.log(`${file.isDirectory() ? '📁' : '📄'} ${path.join(searchDir, file.name)}`);
        });
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  });

program
  .command('update')
  .description('Update to the latest version of CLI')
  .action(async () => {
    try {
      const currentVersion = VERSION;
      const latestVersion = (await packageJson('@yukiookii/haiku')).version;

      console.log(`Current version: ${currentVersion}`);
      console.log(`Latest version available: ${latestVersion}`);

      if (currentVersion === latestVersion) {
        console.log('You are already using the latest version!');
        return;
      }

      console.log('Updating to latest version...');
      execSync('npm install -g @yukiookii/haiku@latest', { stdio: 'inherit' });

      console.log(`Successfully updated CLI from ${currentVersion} to ${latestVersion}`);
    } catch (error) {
      console.error('Error updating to the latest version:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);