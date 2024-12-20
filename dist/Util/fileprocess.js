import * as fs from "fs";
import { handleAnswer } from "./Handle.js";
export async function readFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error("File not found.");
        process.exit(1);
    }
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
        await handleAnswer(false, "Path is a directory. Please specify a file path");
        // console.error("Path is a directory. Please specify a file path");
        process.exit(1);
    }
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n");
}
export async function saveFile(filePath, content) {
    fs.writeFileSync(filePath, content.join("\n"));
    await handleAnswer(true, "File saed successfully");
    // console.log("File saved successfully.");
}
