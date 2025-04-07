
import axios from 'axios';

export type OpenLibraryBook = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  series?: string[];
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
    
    // Add a brief delay to avoid rate limiting issues
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Use a working CORS proxy
    const encodedApiUrl = `${OPEN_LIBRARY_API_URL}?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,series`;
    
    // Try with different CORS proxies in case one is down
    let response;
    try {
      // First try corsproxy.io
      response = await axios.get<OpenLibraryResponse>(
        `https://corsproxy.io/?${encodeURIComponent(encodedApiUrl)}`
      );
    } catch (error) {
      console.log('First CORS proxy failed, trying alternative');
      // Fallback to cors-anywhere if the first one fails
      response = await axios.get<OpenLibraryResponse>(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(encodedApiUrl)}`
      );
    }
    
    console.log('Search results:', response.data.docs);
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
