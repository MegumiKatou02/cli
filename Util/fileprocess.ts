import * as fs from "fs";

export function readFile(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    console.error("File not found.");
    process.exit(1);
  }

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    console.error("Path is a directory. Please specify a file path");
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");
  return content.split("\n");
}

export function saveFile(filePath: string, content: string[]): void {
  fs.writeFileSync(filePath, content.join("\n"));
  console.log("File saved successfully.");
}