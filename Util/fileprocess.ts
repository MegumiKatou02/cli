import * as fs from "fs";
import { handleAnswer } from "./Handle.js";

export async function readFile(filePath: string): Promise<string[]> {
  try {
    if (!fs.existsSync(filePath)) {
      await handleAnswer(false, "File not found.");
      throw new Error("File not found.");
    }

    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      await handleAnswer(false, "Path is a directory. Please specify a file path.");
      throw new Error("Path is a directory. Please specify a file path.");
    }

    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n");
  } catch (error) {
    throw new Error(`Error reading file: ${(error as Error).message}`);
  }
}

export async function saveFile(filePath: string, content: string[]): Promise<void> {
  try {
    fs.writeFileSync(filePath, content.join("\n"));
    await handleAnswer(true, "File saved successfully.");
  } catch (error) {
    await handleAnswer(false, "Error saving file.");
    throw new Error(`Error saving file: ${(error as Error).message}`);
  }
}