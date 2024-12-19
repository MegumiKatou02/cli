import fs from 'fs';
import path from 'path';
import { VERSION } from '../constants/version.js';

export function showVersion() {
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
        console.log(`chx-cli version: ${VERSION}`);
    }
    catch(error) {
        console.log(`chx-cli version: ${VERSION}`);
    }
}