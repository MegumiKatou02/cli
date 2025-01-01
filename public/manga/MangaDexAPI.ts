import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export class TruyenDexImageDownloader {
    private title: string = "title";

    constructor(private logger: (message: string) => void) {}

    public setupTitle(option: string): void {
        if (option === "MangaDex") {
            this.title = "title";
        } else if (option === "TruyenDex") {
            this.title = "truyen-tranh";
        }
    }

    public async fetchChapters(mangaId: string): Promise<{ volume: string, chapter: string, chapterId: string }[]> {
        const apiUrl = `https://api.mangadex.org/manga/${mangaId}/aggregate?translatedLanguage[]=vi`;
        try {
            const response = await axios.get(apiUrl);
            const chapters: { volume: string, chapter: string, chapterId: string }[] = [];

            for (const [volumeNumber, volumeData] of Object.entries(response.data.volumes)) {
                for (const [chapterNumber, chapterInfo] of Object.entries((volumeData as any).chapters)) {
                    chapters.push({
                        volume: volumeNumber,
                        chapter: chapterNumber,
                        chapterId: (chapterInfo as any).id
                    });
                }
            }
            return chapters;
        } catch (error) {
            this.logger(`Failed to fetch chapters. Error: ${(error as Error).message}`);
            return [];
        }
    }

    public async fetchImages(chapterId: string): Promise<string[]> {
        const apiUrl = `https://api.mangadex.org/at-home/server/${chapterId}`;
        try {
            const response = await axios.get(apiUrl);
            const baseUrl = response.data.baseUrl;
            const chapterHash = response.data.chapter.hash;
            const images = response.data.chapter.data;

            return images.map((image: string) => `${baseUrl}/data/${chapterHash}/${image}`);
        } catch (error) {
            this.logger(`Failed to fetch images for chapter ${chapterId}. Error: ${(error as Error).message}`);
            return [];
        }
    }

    public async downloadManga(mangaUrl: string): Promise<void> {
        const mangaIdMatch = mangaUrl.match(new RegExp(`/${this.title}/([a-f0-9\\-]+)`));
        if (!mangaIdMatch) {
            this.logger("Invalid manga URL.");
            return;
        }

        const mangaId = mangaIdMatch[1];
        this.logger(`Starting download for manga: ${mangaId}`);

        const chapters = await this.fetchChapters(mangaId);
        if (chapters.length === 0) {
            return;
        }

        const mangaFolder = path.join(process.cwd(), `manga_${mangaId}`);
        try {
            fs.mkdirSync(mangaFolder, { recursive: true });
        } catch (error) {
            this.logger(`Permission denied when creating directory: ${mangaFolder}`);
            return;
        }

        for (const { volume, chapter, chapterId } of chapters) {
            this.logger(`Downloading volume ${volume}, chapter ${chapter}...`);

            const images = await this.fetchImages(chapterId);
            if (images.length > 0) {
                const chapterFolder = path.join(mangaFolder, `volume_${volume}`, `chapter_${chapter}`);
                fs.mkdirSync(chapterFolder, { recursive: true });

                for (const imageUrl of images) {
                    await this.downloadImage(imageUrl, chapterFolder);
                }
            } else {
                this.logger(`No images found for chapter ${chapter}.`);
            }
        }

        this.logger(`Download completed for manga: ${mangaId}`);
    }

    private async downloadImage(imageUrl: string, saveFolder: string): Promise<void> {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageName = path.basename(imageUrl);
            const imagePath = path.join(saveFolder, imageName);

            fs.writeFileSync(imagePath, response.data);
            this.logger(`Downloaded image: ${imageName}`);
        } catch (error) {
            this.logger(`Error downloading image: ${(error as Error).message}`);
        }
    }
}