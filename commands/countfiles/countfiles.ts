import { readdir } from "fs/promises";
import { statSync } from "fs";
import path from "path";

export async function countFilesAndFoldersShallow(folderPath: string) {
  const entries = await readdir(folderPath);
  let fileCount = 0;
  let folderCount = 0;

  entries.forEach((entry) => {
    const fullPath = path.join(folderPath, entry);
    const stats = statSync(fullPath);
    if (stats.isFile()) {
      fileCount++;
    } else if (stats.isDirectory()) {
      folderCount++;
    }
  });

  console.log(`Files: ${fileCount}`);
  console.log(`Folders: ${folderCount}`);
}