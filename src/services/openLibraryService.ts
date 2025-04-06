
import axios from 'axios';

export type OpenLibraryBook = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
};

export type OpenLibraryResponse = {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
};

const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/search.json';

export const searchBooks = async (query: string): Promise<OpenLibraryBook[]> => {
  try {
    if (!query.trim()) return [];
    
    const response = await axios.get<OpenLibraryResponse>(OPEN_LIBRARY_API_URL, {
      params: {
        q: query,
        limit: 20,
        fields: 'key,title,author_name,cover_i,first_publish_year'
      }
    });
    
    return response.data.docs;
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const getCoverImageUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string => {
  if (!coverId) return '/placeholder.svg';
  
  const sizeMap = {
    'S': '-S',
    'M': '-M',
    'L': '-L'
  };
  
  return `https://covers.openlibrary.org/b/id/${coverId}${sizeMap[size]}.jpg`;
};
