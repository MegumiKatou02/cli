import { Command } from 'commander';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

export class LightNovelDownloader {
    private domain: string = "ln.hako.vn";

    constructor(private logger: (message: string) => void) {}

    public setupDomain(domain: string): void {
        this.domain = domain;
    }

    public async downloadLightNovel(lightNovelUrl: string): Promise<void> {
        const lnFolder = path.join(process.cwd(), "LightNovel");
        try {
            fs.mkdirSync(lnFolder, { recursive: true });
        } catch (error) {
            this.logger(`Permission denied when creating directory: ${lnFolder}`);
            return;
        }

        try {
            const response = await axios.get(lightNovelUrl);
            const $ = cheerio.load(response.data);

            const listItems = $('.chapter-name').toArray();

            for (const item of listItems) {
                const link = $(item).find('a');
                if (link.length > 0) {
                    let title = link.attr('title') || 'Untitled';
                    title = title.replace(/[\/:*?"<>|]/g, '');

                    const chapterUrl = `https://${this.domain}${link.attr('href')}`;
                    this.logger(`Downloading chapter: ${title} - URL: ${chapterUrl}`);

                    const chapterResponse = await axios.get(chapterUrl);
                    const chapter$ = cheerio.load(chapterResponse.data);

                    const filename = path.join(lnFolder, `${title}.txt`);
                    let txt = `${title}\n\n`;

                    chapter$('[id]').each((_, element) => {
                        const id = chapter$(element).attr('id');
                        if (id && !isNaN(Number(id))) {
                            txt += chapter$(element).text() + "\n\n";
                        }
                    });

                    fs.writeFileSync(filename, txt, 'utf-8');
                    this.logger(`Saved to: ${filename}`);
                } else {
                    this.logger("No link found for chapter.");
                }
            }
        } catch (error) {
            this.logger(`Error downloading light novel: ${(error as Error).message}`);
        }
    }
}