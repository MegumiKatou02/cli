import { readdir, stat } from "fs/promises";
import path from "path";

export async function countFilesAndFoldersShallow(folderPath: string) {
  const entries = await readdir(folderPath);
  let fileCount = 0;
  let folderCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry);
    try {
      const stats = await stat(fullPath);
      if (stats.isFile()) {
        fileCount++;
      } else if (stats.isDirectory()) {
        folderCount++;
      }
    } catch (error) {
      console.warn(`Access denied or file/directory not accessible: ${fullPath}`);
    }
  }

  console.log(`Files: ${fileCount}`);
  console.log(`Folders: ${folderCount}`);
}