import axios from 'axios';
import chalk from 'chalk';

const API_URL = 'https://graphql.anilist.co';

const SEARCH_CHARACTER_QUERY = `
  query ($name: String) {
    Character(search: $name) {
      name {
        full
      }
      media {
        nodes {
          title {
            english
            romaji
          }
        }
      }
      description
      gender
    }
  }
`;

export async function searchCharacter(name: string) {
  try {
    const response = await axios.post(API_URL, {
      query: SEARCH_CHARACTER_QUERY,
      variables: { name },
    });

    const character = response.data.data.Character;
    if (!character) {
      console.log(chalk.red('No character found.'));
      return;
    }

    console.log(chalk.blue.bold(`Name: ${character.name.full}`));
    console.log(chalk.blue.bold(`Gender: ${character.gender || 'Unknown'}`));
    console.log(chalk.blue.bold('Appears in:'));
    character.media.nodes.forEach((media: any) => {
      console.log(`- ${media.title.english || media.title.romaji}`);
    });
    // console.log(chalk.blue.bold('Description:'));
    // console.log(character.description || 'No description available.');
  } catch (error) {
    console.error(chalk.red('Error fetching character data:'), (error as Error).message);
  }
}