
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import { useBookModalContext } from '@/contexts/BookModalContext';

const BookQuizTab: React.FC = () => {
  const { bookData, addEmptyQuiz, updateQuiz, removeQuiz } = useBookModalContext();
  const quizzes = bookData.quizzes;
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground mb-2">Create quiz questions to test your knowledge about this book.</p>
        <Button 
          onClick={addEmptyQuiz} 
          variant="outline" 
          size="sm"
          className="mx-auto"
        >
          Add Quiz Question
        </Button>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No quiz questions yet</p>
          <p className="text-sm">Click the button above to add your first question</p>
        </div>
      ) : (
        <div className="space-y-5">
          {quizzes.map((quiz, index) => (
            <div key={index} className="border rounded-md p-3 space-y-3 relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-2 h-6 w-6 p-0" 
                onClick={() => removeQuiz(index)}
              >
                ×
              </Button>
              <div className="grid gap-2">
                <Label htmlFor={`question-${index}`}>Question</Label>
                <Input
                  id={`question-${index}`}
                  value={quiz.question}
                  onChange={(e) => updateQuiz(index, 'question', e.target.value)}
                  placeholder="Enter your question here..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`answer-${index}`}>Answer</Label>
                <Input
                  id={`answer-${index}`}
                  value={quiz.answer}
                  onChange={(e) => updateQuiz(index, 'answer', e.target.value)}
                  placeholder="Enter the answer here..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookQuizTab;
