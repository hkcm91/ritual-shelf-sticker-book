
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

// Define CORS proxies
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://proxy.cors.sh/${url}`
];

export const searchBooks = async (query: string): Promise<OpenLibraryBook[]> => {
  try {
    if (!query.trim()) return [];
    
    console.log('Searching for books with query:', query);
    
    // Add a brief delay to avoid rate limiting issues
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Build the API URL
    const apiUrl = `${OPEN_LIBRARY_API_URL}?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,series`;
    
    // Try each CORS proxy until one works
    let response = null;
    let lastError = null;
    
    for (const proxyFn of CORS_PROXIES) {
      try {
        const proxyUrl = proxyFn(apiUrl);
        console.log('Trying CORS proxy URL:', proxyUrl);
        
        response = await axios.get<OpenLibraryResponse>(proxyUrl, {
          timeout: 10000, // 10 second timeout - increased for reliability
          headers: {
            'Accept': 'application/json'
          }
        });
        
        // Check if we got a valid response with books
        if (response.data && response.data.docs && Array.isArray(response.data.docs)) {
          console.log(`Proxy ${proxyUrl} succeeded with ${response.data.docs.length} results`);
          break; // Success - exit the loop
        } else {
          console.warn('Proxy returned invalid response format:', response.data);
          // Continue to next proxy
        }
      } catch (error) {
        console.warn('CORS proxy failed:', error);
        lastError = error;
        // Continue to the next proxy
      }
    }
    
    // If all proxies failed
    if (!response || !response.data || !response.data.docs || !Array.isArray(response.data.docs)) {
      console.error('All CORS proxies failed or returned invalid data:', lastError);
      throw new Error('Could not connect to Open Library API');
    }
    
    console.log('Search results:', response.data.docs);
    return response.data.docs;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error; // Re-throw to allow proper error handling
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
