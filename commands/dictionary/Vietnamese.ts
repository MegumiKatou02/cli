import chalk from 'chalk'
import axios from 'axios';
import { VIETNAMESE_DIC } from '../../constants/URLs.js';

const base_url = VIETNAMESE_DIC; 

const suggestionWord = async (word: string): Promise<void> => {
    try {
        const mainUrl: string = `${base_url}/search?word=${word}&suggestion=true`;
        const response = await axios.get(mainUrl)
        if(response.status === 200) {
            const data = response.data;
            if (!data.valid) {
                console.log(chalk.red(`${word} is not in the dictionary`));
                return;
            }
            console.log(chalk.yellow(`suggestions for '${word}':`));
            const suggestions = data.suggestions
            suggestions.forEach((value: string) => {
                console.log(chalk.green(`\t${value}`));
            });
        }
        else {
            console.log(chalk.red(`Invalid data or API error: null`));
        }
    } catch (error) {
        console.log(chalk.red("Error when fetching api", (error as Error).message));
    }
}

const isValidWord = async (word: string): Promise<void> => {
    try {
        const mainUrl: string = `${base_url}/search?word=${word}`;
        const response = await axios.get(mainUrl)
        if(response.status === 200) {
            const data = response.data;
            if (data.valid) {
                console.log(chalk.green(`${word} is in the dictionary`));
            }
            else {
                console.log(chalk.red(`${word} is not in the dictionary`));
            }
        }
        else {
            console.log(chalk.red('Invalid data or API error: null'));
        }
    } catch (error) {
        console.log(chalk.red("Error when fetching api", (error as Error).message));
    }
}

export { isValidWord, suggestionWord }