import { readdir } from 'fs/promises';
import path from 'path';

export async function countFilesAndFoldersDeep(folderPath: string) {
  let fileCount = 0;
  let folderCount = 0;

  const traverse = async (currentPath: string) => {
    try {
      const entries = await readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isFile()) {
          fileCount++;
        } else if (entry.isDirectory()) {
          folderCount++;
          await traverse(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
    }
  };

  await traverse(folderPath);

  console.log(`Total Files: ${fileCount}`);
  console.log(`Total Folders: ${folderCount}`);
}