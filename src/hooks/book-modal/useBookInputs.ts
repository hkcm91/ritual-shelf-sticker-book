
import { useState } from 'react';

export type BookInputs = {
  title: string;
  author: string;
  series: string;
  progress: number;
  rating: number;
  characters: string[];
  plot: string;
  notes: string;
};

export const useBookInputs = (initialInputs: BookInputs) => {
  const [inputs, setInputs] = useState<BookInputs>(initialInputs);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'characters') {
      // Split the text input by commas to create an array of characters
      const charactersArray = value.split(',').map(item => item.trim());
      setInputs(prev => ({ ...prev, characters: charactersArray }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: name === 'progress' ? Math.min(100, Math.max(0, parseInt(value) || 0)) : value,
      }));
    }
  };
  
  const setRating = (rating: number) => {
    setInputs((prev) => ({ ...prev, rating }));
  };
  
  return {
    inputs,
    setInputs,
    handleInputChange,
    setRating
  };
};
