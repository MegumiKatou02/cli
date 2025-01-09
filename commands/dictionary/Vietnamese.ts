import chalk from 'chalk'
import axios from 'axios';
import { VIETNAMESE_DIC } from '../../constants/URLs.js';

const base_url = VIETNAMESE_DIC; 

const isValidWord = async (word: string): Promise<boolean | null> => {
    try {
        const response = await axios.get(`${base_url}/search?word=${word}`)
        if(response.status === 200) {
            const data = response.data;
            return data.valid;
        }
        else {
            return null;
        }
    } catch (error) {
        console.log(chalk.red("Error when fetching api", (error as Error).message));
        return null;
    }
}

export { isValidWord }