#!/usr/bin/env node

import fs from 'fs';
import { Command } from 'commander';
import { showVersion } from '../commands/version.js';
import { qrCommand } from '../commands/qr.js'; 
import { welcome } from '../commands/info.js';
import { generatePassword, Option } from '../commands/password.js'
import { VERSION } from '../constants/version.js';
import { countFilesAndFolders } from '../commands/countfiles.js'

import { readFile, saveFile } from "../Util/fileprocess.js";
import { editFile } from "../commands/editFile.js";
import readlineSync from "readline-sync";
import simpleGit from 'simple-git';
import packageJson from 'package-json';
import { execSync } from 'child_process';

const git = simpleGit();

const program = new Command();

program
  .name('chx-cli')
  .description('A custom CLI tool for special tasks')
  .version(`${VERSION}`, '-v, --version', 'Show current version of chx-cli');

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
  .action(() => {
    Option();
  })

program
  .command("count <path>")
  .description("Count files and folders in a directory")
  .action(async (folderPath) => {
    await countFilesAndFolders(folderPath);
  });

program
  .command("edit")
  .description("edit file")
  .action(async () => {
    const filePath = readlineSync.question("Enter file path: ");
    const content = await readFile(filePath);
    
    console.log("=== File content ===");
    content.forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });

    const updatedContent = await editFile(content);
    await saveFile(filePath, updatedContent);
  });

program
  .command('clone <repoUrl>')
  .description('Clone a GitHub repository into the current directory')
  .action(async (repoUrl) => {
    try {
      console.log(`Cloning repository from ${repoUrl} into the current directory...`);
      await git.clone(repoUrl);
      console.log('Successfully cloned the repository into the current directory');
    } catch (error) {
      console.error('Error cloning the repository:', error);
    }
  });

  program
  .command('update')
  .description('Update to the latest version of CLI')
  .action(async () => {
    try {
      const { name, version: currentVersion } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      
      const latestVersion = (await packageJson(name)).version;
      console.log(`Current version: ${currentVersion}`);
      console.log(`Latest version available: ${latestVersion}`);

      if (currentVersion === latestVersion) {
        console.log('You are already using the latest version!');
        return;
      }

      console.log('Updating to latest version...');
      execSync('npm install -g chx-cli@latest', { stdio: 'inherit' });
      
      console.log(`Successfully updated CLI from ${currentVersion} to ${latestVersion}`);
    } catch (error) {
      console.error('Error updating to the latest version:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);