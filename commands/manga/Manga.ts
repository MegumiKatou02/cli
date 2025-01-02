import axios from 'axios';

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
    title: string;
    description: string;
    status: string;
    tags: string[];
    links: { [key: string]: string };
}

function filterMangaData(manga: Manga): FilteredManga {
    return {
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description:
        manga.attributes.description.en || Object.values(manga.attributes.description)[0],
      status: manga.attributes.status,
      tags: manga.attributes.tags.map((tag) => tag.attributes.name.en),
      links: manga.attributes.links,
    };
}

async function searchManga(title: string) {
    const baseUrl = 'https://api.mangadex.org';
  
    try {
      const response = await axios.get(`${baseUrl}/manga`, {
        params: {
          title: title,
        },
      });
  
      const filteredData = response.data.data.map((manga: Manga) =>
        filterMangaData(manga)
      );
  
      console.log('Search results:');
      console.log(JSON.stringify(filteredData, null, 2));
    } catch (error) {
      console.error('Failed to search manga:', (async function searchManga(title: string) {
        const baseUrl = 'https://api.mangadex.org';
      
        try {
          const response = await axios.get(`${baseUrl}/manga`, {
            params: {
              title: title,
            },
          });
      
          const filteredData = response.data.data.map((manga: Manga) =>
            filterMangaData(manga)
          );
      
          console.log('Search results:');
          console.log(JSON.stringify(filteredData, null, 2));
        } catch (error) {
          console.error('Failed to search manga:', (error as Error).message);
        }
      }));
    }
}