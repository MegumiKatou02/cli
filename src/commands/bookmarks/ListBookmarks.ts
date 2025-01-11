import { promises as fs, constants as fsConstants } from 'fs';
import path from 'path';

export async function ListBookMarks() {
    const filePath = path.join(process.cwd(), 'bookmarks.json');
    console.log(`Looking for bookmarks.json at: ${filePath}`);

    try {
        await fs.access(filePath, fsConstants.F_OK);

        const data = await fs.readFile(filePath, 'utf8');

        if (!data.trim()) {
            console.log('File bookmarks.json is empty.');
            return;
        }

        const bookmarks = data
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed && parsed.name && parsed.url) {
                        return parsed;
                    }
                    return null;
                } catch (parseError) {
                    console.error(`Error parsing JSON: ${line}`, parseError);
                    return null;
                }
            })
            .filter(bookmark => bookmark !== null);

        if (bookmarks.length > 0) {
            console.log('List of bookmarks:');
            bookmarks.forEach(bookmark => {
                console.log(`Name: ${bookmark.name}, URL: ${bookmark.url}`);
            });
        } else {
            console.log('No bookmarks found.');
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('ENOENT')) {
                console.error('File bookmarks.json does not exist. Creating a new one...');
                await fs.writeFile(filePath, JSON.stringify([]));
            } else {
                console.error('Error listing bookmarks:', error.message);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}