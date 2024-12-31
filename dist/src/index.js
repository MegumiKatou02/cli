#!/usr/bin/env node
import fs, { promises as profs } from 'fs';
import path from 'path';
import { Command } from 'commander';
import { showVersion } from '../commands/version.js';
import { qrCommand } from '../commands/qr.js';
import { welcome } from '../commands/info.js';
import { OptionPassword } from '../commands/password.js';
import { VERSION } from '../constants/version.js';
import { countFilesAndFoldersShallow } from '../commands/countfiles/countfiles.js';
import { countFilesAndFoldersDeep } from '../commands/countfiles/countfilesdeep.js';
import { getWeatherCommand } from '../commands/getweather.js';
import { monitorSystemCommand } from '../commands/monitorSystem.js';
import { convertImageCommand } from '../commands/convertImage.js';
import { resizeImage } from '../commands/imageresize.js';
import { readFile, saveFile } from "../utils/fileprocess.js";
import { editFile } from "../commands/editFile.js";
import readlineSync from "readline-sync";
import simpleGit from 'simple-git';
import packageJson from 'package-json';
import { execSync } from 'child_process';
import { listProcesses } from '../commands/system/listProccesses.js';
import { killProcess } from '../commands/system/killProcess.js';
import { monitorProcess } from '../utils/processUtils.js';
import { handleFindProcess } from '../commands/system/findProcess.js';
import { getNetworkInfo } from '../commands/networkInfo.js';
import { encryptFile } from '../commands/code/encrypt.js';
import { decryptFile } from '../commands/code/decrypt.js';
const git = simpleGit();
const program = new Command();
program
    .name('haiku')
    .description('A custom CLI tool for special tasks')
    .version(`${VERSION}`, '-v, --version', 'Show current version of Haiku CLI');
program
    .command('encrypt <inputFile> <outputFile>')
    .description('Encrypt a file')
    .action((inputFile, outputFile) => {
    encryptFile(inputFile, outputFile);
});
program
    .command('decrypt <inputFile> <outputFile>')
    .description('Decrypt a file')
    .action((inputFile, outputFile) => {
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
    .description('List all running processes')
    .action(listProcesses);
program
    .command('kill <pid>')
    .description('Kill a process by PID')
    .action((pid) => {
    killProcess(parseInt(pid));
});
program
    .command('monitor <pid>')
    .description('Monitor a process by PID')
    .action((pid) => {
    monitorProcess(parseInt(pid));
});
program
    .command('find <name>')
    .description('Find processes by name')
    .option('-e, --exact', 'Exact match')
    .option('-l, --limit <number>', 'Limit the number of results', parseInt)
    .action((name, options) => {
    handleFindProcess(name, options.exact, options.limit);
});
program
    .command('resize <input> <output>')
    .description('Resize an image and adjust its quality.')
    .option('-w, --width <number>', 'Target width in pixels')
    .option('-h, --height <number>', 'Target height in pixels')
    .option('-q, --quality <number>', 'Output quality (0-100)', '75')
    .action(async (input, output, options) => {
    try {
        if (!fs.existsSync(input)) {
            throw new Error(`Input file not found: ${input}`);
        }
        const width = options.width ? parseInt(options.width) : undefined;
        const height = options.height ? parseInt(options.height) : undefined;
        const quality = options.quality ? parseInt(options.quality) : 75;
        if (width !== undefined && isNaN(width)) {
            throw new Error('Width must be a valid number.');
        }
        if (height !== undefined && isNaN(height)) {
            throw new Error('Height must be a valid number.');
        }
        if (isNaN(quality) || quality < 0 || quality > 100) {
            throw new Error('Quality must be a number between 0 and 100.');
        }
        await resizeImage(input, output, width, height, quality);
        console.log(`Image saved to ${output}`);
    }
    catch (err) {
        console.error('Error:', err instanceof Error ? err.message : 'An unknown error occurred.');
    }
});
program.addCommand(convertImageCommand);
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
});
program
    .command('password')
    .description('Generate random password with options')
    .action(async () => {
    try {
        await OptionPassword();
    }
    catch (error) {
        console.log(error.message);
    }
});
program
    .command("count <path>")
    .option("--d", "Recursively count files and folders in subdirectories")
    .description("Count files and folders in a directory")
    .action(async (path, options) => {
    try {
        if (options.d) {
            await countFilesAndFoldersDeep(path);
        }
        else {
            await countFilesAndFoldersShallow(path);
        }
    }
    catch (error) {
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
    }
    catch (error) {
        console.log(error.message);
    }
});
program
    .command('clone <repoUrl>')
    .description('Clone a GitHub repository into the current directory')
    .action(async (repoUrl) => {
    try {
        console.log(`Cloning repository from ${repoUrl} into the current directory...`);
        await git.clone(repoUrl);
        console.log('Successfully cloned the repository into the current directory');
    }
    catch (error) {
        console.error('Error cloning the repository:', error);
    }
});
program
    .command('branch [branchName]')
    .description('Create, delete, or list Git branches')
    .option('-d, --delete', 'Delete a branch')
    .action(async (branchName, options) => {
    try {
        if (options.delete) {
            console.log(`Deleting branch: ${branchName}...`);
            await git.deleteLocalBranch(branchName);
            console.log(`Branch ${branchName} deleted successfully.`);
        }
        else if (branchName) {
            console.log(`Creating branch: ${branchName}...`);
            await git.checkoutLocalBranch(branchName);
            console.log(`Branch ${branchName} created successfully.`);
        }
        else {
            console.log('Listing branches...');
            const branches = await git.branch();
            console.log(branches.all);
        }
    }
    catch (error) {
        console.error('Error managing branches:', error);
    }
});
program
    .command('push')
    .description('Push changes to the remote Git repository')
    .action(async () => {
    try {
        console.log('Pushing changes to the remote repository...');
        await git.push();
        console.log('Changes pushed successfully.');
    }
    catch (error) {
        console.error('Error pushing changes:', error);
    }
});
program
    .command('pull')
    .description('Pull changes from the remote Git repository')
    .action(async () => {
    try {
        console.log('Pulling changes from the remote repository...');
        await git.pull();
        console.log('Changes pulled successfully.');
    }
    catch (error) {
        console.error('Error pulling changes:', error);
    }
});
program
    .command('log')
    .description('Show the commit history of the Git repository')
    .action(async () => {
    try {
        console.log('Fetching commit history...');
        const log = await git.log();
        log.all.forEach(commit => {
            console.log(`Commit: ${commit.hash} - ${commit.message}`);
        });
    }
    catch (error) {
        console.error('Error fetching commit history:', error);
    }
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
        if (extension)
            console.log(`Filtering by extension .${extension}`);
        if (query)
            console.log(`Filtering by query "${query}"`);
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
        }
        else {
            console.log('No results found.');
        }
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Error updating to the latest version:', error);
        process.exit(1);
    }
});
program.parse(process.argv);
