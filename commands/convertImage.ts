import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Command } from 'commander';

export const convertImageCommand = new Command('convert-image')
  .description('Convert an image to a different format')
  .argument('<input>', 'Input image file path')
  .option('-f, --format <format>', 'Output format', 'png')
  .action(async (input, options) => {
    const inputPath = input;
    const outputFormat = options.format.toLowerCase();
    
    if (!fs.existsSync(inputPath)) {
      console.error(`File not found: ${inputPath}`);
      process.exit(1);
    }
    
    const outputPath = changeExtension(inputPath, outputFormat);
    
    try {
      await sharp(inputPath).toFormat(outputFormat).toFile(outputPath);
      console.log(`Image saved to ${outputPath}`);
    } catch (error) {
      console.error(`Error converting image: ${(error as Error).message}`);
      process.exit(1);
    }
    process.exit(0);
  });
  
function changeExtension(inputPath: string, extension: string): string {
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  return path.join(dir, `${name}.${extension}`);
}