#!/usr/bin/env node

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
  .action(() => {
    const filePath = readlineSync.question("Enter file path: ");
    const content = readFile(filePath);
    
    console.log("=== File content ===");
    content.forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });

    const updatedContent = editFile(content);
    saveFile(filePath, updatedContent);
  });

program.parse(process.argv);