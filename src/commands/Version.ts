import fs from 'fs';
import path from 'path';
import { VERSION } from '../constants/Version.js';

export function showVersion() {
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
        console.log(`version: ${VERSION}`);
    }
    catch(error) {
        console.log(`version: ${VERSION}`);
    }
}