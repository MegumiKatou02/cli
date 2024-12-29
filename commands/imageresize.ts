import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

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