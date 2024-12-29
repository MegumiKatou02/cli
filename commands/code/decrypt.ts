import { createReadStream, createWriteStream } from 'fs';
import { decrypt } from '../../utils/crypto.js';

export function decryptFile(inputFile: string, outputFile: string): void {
  const input = createReadStream(inputFile);
  const output = createWriteStream(outputFile);

  input.on('data', (chunk: Buffer) => {
    const decrypted = decrypt(chunk);
    output.write(decrypted);
  });

  input.on('end', () => {
    output.end();
    console.log(`File decrypted and saved to: ${outputFile}`);
  });

  input.on('error', (err) => {
    console.error('Error reading input file:', err);
  });

  output.on('error', (err) => {
    console.error('Error writing output file:', err);
  });
}