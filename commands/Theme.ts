import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const THEMES_DIR = path.join(process.cwd(), 'themes');

function initThemesDir() {
    if (!fs.existsSync(THEMES_DIR)) {
        fs.mkdirSync(THEMES_DIR);
        console.log(`Created '${THEMES_DIR}' directory.`);
    }
}

function installTheme(themeName: string) {
    const themePath = path.join(THEMES_DIR, themeName);
    if (fs.existsSync(themePath)) {
        console.log(`Theme '${themeName}' already exists.`);
    } else {
        fs.mkdirSync(themePath);
        console.log(`Theme '${themeName}' installed successfully.`);
    }
}

function listThemes() {
    if (!fs.existsSync(THEMES_DIR)) {
        console.log('No themes installed.');
    } else {
        const themes = fs.readdirSync(THEMES_DIR);
        if (themes.length > 0) {
            console.log('Installed themes:');
            themes.forEach((theme) => console.log(`- ${theme}`));
        } else {
            console.log('No themes installed.');
        }
    }
}

function applyTheme(themeName: string) {
    const themePath = path.join(THEMES_DIR, themeName);
    if (fs.existsSync(themePath)) {
        console.log(`Theme '${themeName}' applied successfully.`);
    } else {
        console.log(`Theme '${themeName}' does not exist.`);
    }
}

function deleteTheme(themeName: string) {
    const themePath = path.join(THEMES_DIR, themeName);
    if (fs.existsSync(themePath)) {
        fs.rmdirSync(themePath, { recursive: true });
        console.log(`Theme '${themeName}' deleted successfully.`);
    } else {
        console.log(`Theme '${themeName}' does not exist.`);
    }
}