import axios from 'axios';
import { BASE_URL_MANGADEX, MANGADEX_DOMAIN } from '../../constants/URLs.js';
import chalk from 'chalk'

interface Manga {
    id: string;
    attributes: {
        title: { [key: string]: string };
        description: { [key: string]: string };
        status: string;
        tags: { attributes: { name: { en: string } } }[];
        links: { [key: string]: string };
    };
}

interface FilteredManga {
    id: string;
    title: string;
    description: string;
    status: string;
    tags: string[];
    links: { [key: string]: string };
}

export async function getTagIDs(tagNames: string[]): Promise<string[]> {
    try {
        const response = await axios.get(`${BASE_URL_MANGADEX}/manga/tag`);
        return response.data.data
            .filter((tag: any) => tagNames.includes(tag.attributes.name.en))
            .map((tag: any) => tag.id);
    } catch (error) {
        console.error(chalk.red('Failed to fetch tags:'), (error as Error).message);
        throw error;
    }
}

export async function searchManga(options: {
    title?: string;
    includedTags?: string[];
    excludedTags?: string[];
}): Promise<FilteredManga[]> {
    try {
        const params: any = {};

        if (options.title) {
            params.title = options.title;
        }

        if (options.includedTags && options.includedTags.length > 0) {
            params.includedTags = options.includedTags;
        }

        if (options.excludedTags && options.excludedTags.length > 0) {
            params.excludedTags = options.excludedTags;
        }

        const response = await axios.get(`${BASE_URL_MANGADEX}/manga`, { params });

        if (!response.data.data || !Array.isArray(response.data.data)) {
            console.log(chalk.yellow('No manga found.'));
            return [];
        }

        const uniqueMangaList = response.data.data.filter(
            (manga: Manga, index: number, self: Manga[]) =>
                self.findIndex((m) => m.id === manga.id) === index
        );

        const filteredData = uniqueMangaList.map((manga: Manga) =>
            filterMangaData(manga)
        );

        // displayMangaResults(filteredData);
        return filteredData;
    } catch (error) {
        console.error(chalk.red('Failed to search manga:'), (error as Error).message);
        throw error;
    }
}

function filterMangaData(manga: Manga): FilteredManga {
    return {
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        description: manga.attributes.description.en || Object.values(manga.attributes.description)[0],
        status: manga.attributes.status,
        tags: manga.attributes.tags.map((tag) => tag.attributes.name.en),
        links: manga.attributes.links,
    };
}

export function displayMangaResults(mangaList: FilteredManga[]) {
    if (mangaList.length === 0) {
        console.log(chalk.yellow('No manga found.'));
        return;
    }

    console.log(chalk.green.bold('=== Search Results ==='));
    mangaList.forEach((manga, index) => {
        const url = `${MANGADEX_DOMAIN}/title/${manga.id}`;

        console.log(chalk.cyan.bold(`\n=== Manga ${index + 1} ===`));
        console.log(chalk.whiteBright(`MangaDex link: ${chalk.underline.cyan(url)}`));
        console.log(chalk.whiteBright(`Title: ${chalk.bold.magenta(manga.title)}`));
        console.log(chalk.whiteBright(`Description: ${chalk.italic.gray(manga.description)}`));
        console.log(chalk.whiteBright(`Status: ${chalk.bold.blue(manga.status)}`));
        console.log(chalk.whiteBright(`Tags: ${chalk.italic.yellow(manga.tags.join(', '))}`));
        console.log(chalk.whiteBright.bold('Links:'));
        for (const [key, value] of Object.entries(manga.links)) {
            console.log(chalk.whiteBright(`  ${chalk.bold.green(key)}: ${chalk.underline.cyan(value)}`));
        }
    });
}

export async function searchOnlyManga(title: string): Promise<FilteredManga[]> {
    const baseUrl = BASE_URL_MANGADEX;

    try {
        const response = await axios.get(`${baseUrl}/manga`, {
            params: { title },
        });

        if (!response.data.data || !Array.isArray(response.data.data)) {
            console.log(chalk.yellow('No manga found.'));
            return [];
        }

        const filteredData = response.data.data.map((manga: Manga) =>
            filterMangaData(manga)
        );

        // displayMangaResults(filteredData);
        return filteredData;
    } catch (error) {
        console.error(chalk.red('Failed to search manga:'), (error as Error).message);
        throw error;
    }
}