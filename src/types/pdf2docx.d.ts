declare module 'pdf2docx' {
    export class Converter {
      constructor(inputFile: string);
      convert(outputFile: string, options?: { start?: number; end?: number }): Promise<void>;
      close(): void;
    }
  }