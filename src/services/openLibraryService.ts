
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use a CORS proxy to avoid the CORS issues
    const proxyUrl = 'https://corsproxy.io/?';
    const encodedApiUrl = encodeURIComponent(`${OPEN_LIBRARY_API_URL}?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,series`);
    
    const response = await axios.get<OpenLibraryResponse>(`${proxyUrl}${encodedApiUrl}`);
    
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
