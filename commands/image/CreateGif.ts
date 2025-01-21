import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function createGIF(inputFolder: string, outputFile: string, options: { delay?: number; width?: number; height?: number }) {
    try {
        if (!fs.existsSync(inputFolder)) {
            throw new Error(`Input folder not found: ${inputFolder}`);
        }

        const files = fs.readdirSync(inputFolder).filter((file) => /\.(jpg|jpeg|png)$/i.test(file));
        if (files.length === 0) {
            throw new Error('No image files found in the input folder.');
        }
        console.log(`Found ${files.length} images in the input folder.`);

        const frames = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(inputFolder, file);
                console.log(`Processing image: ${filePath}`);
                return sharp(filePath)
                    .resize(options.width, options.height)
                    .toBuffer();
            })
        );

        await sharp(frames[0], { animated: true })
            .gif({
                delay: options.delay || 100,
                loop: 0,
            })
            .composite(
                frames.slice(1).map((frame) => ({
                    input: frame,
                    tile: true, 
                    delay: options.delay || 100,
                }))
            )
            .toFile(outputFile);

        console.log(`GIF created successfully: ${outputFile}`);
    } catch (err) {
        console.error('Error creating GIF:', err instanceof Error ? err.message : 'An unknown error occurred.');
    }
}