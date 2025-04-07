
import { useState } from 'react';

type QuizItem = {
  question: string;
  answer: string;
};

export const useBookQuizzes = (initialQuizzes: QuizItem[] = []) => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initialQuizzes);
  
  const addEmptyQuiz = () => {
    setQuizzes(prev => [...prev, { question: '', answer: '' }]);
  };
  
  const updateQuiz = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[index] = { 
      ...updatedQuizzes[index], 
      [field]: value 
    };
    
    setQuizzes(updatedQuizzes);
  };
  
  const removeQuiz = (index: number) => {
    setQuizzes(prev => prev.filter((_, i) => i !== index));
  };
  
  return {
    quizzes,
    setQuizzes,
    addEmptyQuiz,
    updateQuiz,
    removeQuiz
  };
};
