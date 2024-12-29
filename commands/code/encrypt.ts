import { createReadStream, createWriteStream } from 'fs';
import { encrypt } from '../../utils/crypto.js';

export function encryptFile(inputFile: string, outputFile: string): void {
  const input = createReadStream(inputFile);
  const output = createWriteStream(outputFile);

  input.on('data', (chunk: Buffer) => {
    const encrypted = encrypt(chunk);
    output.write(encrypted);
  });

  input.on('end', () => {
    output.end();
    console.log(`File encrypted and saved to: ${outputFile}`);
  });

  input.on('error', (err) => {
    console.error('Error reading input file:', err);
  });

  output.on('error', (err) => {
    console.error('Error writing output file:', err);
  });
}