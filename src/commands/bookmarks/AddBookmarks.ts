import { promises as fs } from 'fs';
import path from 'path';

export async function AddBookMarks(name: string, url: string) {
    const filePath = path.join(process.cwd(), 'bookmarks.json');

    console.log(`File will be created at: ${filePath}`);
    console.log(`Current directory: ${process.cwd()}`);

    try {
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify([]));
            console.log(`File created at: ${filePath}`);
        }

        const data = await fs.readFile(filePath, 'utf8');
        let bookmarks = [];

        if (data.trim()) {
            bookmarks = data
                .split('\n')
                .filter(line => line.trim())
                .map(line => JSON.parse(line));
        }

        const bookmark = { name, url };
        bookmarks.push(bookmark);

        await fs.writeFile(filePath, bookmarks.map(b => JSON.stringify(b)).join('\n'));
        console.log('Bookmark added successfully.');
    } catch (error) {
        console.error('Error adding bookmark:', (error as Error).message);
    }
}