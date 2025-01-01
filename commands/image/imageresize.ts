import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export async function resizeImage(
  input: string,
  output: string,
  width?: number,
  height?: number,
  quality: number = 75
): Promise<void> {
  if (!fs.existsSync(input)) {
    throw new Error(`Input file not found: ${input}`);
  }

  const outputDir = path.dirname(output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let dimensions: sharp.ResizeOptions = {};
  if (width && height) {
    dimensions = { width, height };
  } else if (width) {
    dimensions = { width, withoutEnlargement: true };
  } else if (height) {
    dimensions = { height, withoutEnlargement: true };
  }

  try {
    const metadata = await sharp(input).metadata();
    if (!metadata.format) {
      throw new Error('Input is not a valid image file.');
    }

    if (metadata.format === 'png' && quality !== undefined) {
      console.warn('Quality settings do not apply to lossless formats like PNG.');
    }

    await sharp(input)
      .resize(dimensions)
      .toFormat(metadata.format || 'jpeg', { quality })
      .toFile(output);
  } catch (err) {
    throw new Error(`Error processing image: ${err}`);
  }
}

export async function resizeImagesCommand(input: string, output: string, options: { width?: string; height?: string; quality?: string }) {
  try {
    if (!fs.existsSync(input)) {
      throw new Error(`Input file not found: ${input}`);
    }

    const width = options.width ? parseInt(options.width) : undefined;
    const height = options.height ? parseInt(options.height) : undefined;
    const quality = options.quality ? parseInt(options.quality) : 75;

    if (width !== undefined && isNaN(width)) {
      throw new Error('Width must be a valid number.');
    }
    if (height !== undefined && isNaN(height)) {
      throw new Error('Height must be a valid number.');
    }
    if (isNaN(quality) || quality < 0 || quality > 100) {
      throw new Error('Quality must be a number between 0 and 100.');
    }

    await resizeImage(input, output, width, height, quality);
    console.log(chalk.green(`Image saved to ${chalk.bold(output)}`));
  } catch (err) {
    const mess = err instanceof Error ? err.message : 'An unknown error occurred.';
    console.error('Error:', chalk.red(mess));
  }
}