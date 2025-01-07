import axios from "axios";
import { KanjiStyle } from "./Kanji.js";

const base_url = 'https://kanjiapi.dev/v1';

async function getKanji(query: string, style: KanjiStyle) {
    try {
        const response = await axios.get(`${base_url}/${style}/${query}`);
        if(response.status === 200) {
            console.log(JSON.stringify(response.data, null, 2))
        }
    else console.log('khong ok');
    } catch (err) {
        console.error("error fetching kanji", (err as Error).message);
    }
}

export { getKanji }

/**
 * 
 * node start kanji --reading <word>
 * node start kanji --kanji <word>
 * 
*/