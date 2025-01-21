import { readdir, lstat } from 'fs/promises';
import path from 'path';

export async function countFilesAndFoldersDeep(folderPath: string) {
  let fileCount = 0;
  let folderCount = 0;

  const stack = [folderPath];
  while (stack.length > 0) {
    const currentPath = stack.pop();
    if (!currentPath) continue;

    try {
      const entries = await readdir(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isSymbolicLink()) {
          continue;
        }

        if (entry.isFile()) {
          fileCount++;
        } else if (entry.isDirectory()) {
          folderCount++;
          stack.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Skipped inaccessible directory: ${currentPath}`);
    }
  }

  console.log(`Total Files: ${fileCount}`);
  console.log(`Total Folders: ${folderCount}`);
}