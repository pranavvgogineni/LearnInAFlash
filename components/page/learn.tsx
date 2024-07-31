'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getAllFlashcards } from '@/actions/api/flashcards/route';

interface Flashcard {
  id: number;
  set_id: number;
  question: string;
  answer: string;
}

interface FlashcardProps {
  set_id: number;
}

export default function Learn({ set_id }: FlashcardProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Flashcard | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null); // State for feedback message
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const result = await getAllFlashcards(set_id);
      setFlashcards(result || []);
      setLoading(false);
    };

    fetchFlashcards();
  }, [set_id]);

  useEffect(() => {
    if (flashcards.length > 0) {
      generateQuestion(flashcards);
    }
  }, [flashcards]);

  const generateQuestion = (flashcards: Flashcard[]) => {
    const questionIndex = Math.floor(Math.random() * flashcards.length);
    const question = flashcards[questionIndex];
    const remainingFlashcards = flashcards.filter((_, index) => index !== questionIndex);
    const shuffledFlashcards = remainingFlashcards.sort(() => Math.random() - 0.5);
    const distractors = shuffledFlashcards.slice(0, 3).map(flashcard => flashcard.answer);
    const options = [question.answer, ...distractors].sort(() => Math.random() - 0.5);

    setCurrentQuestion(question);
    setOptions(options);
    setFeedback(null); // Reset feedback for the new question
  };

  const handleClick = (answer: string) => {
    if (answer === currentQuestion?.answer) {
      setFeedback('Correct! You clicked the right answer.');
    } else {
      setFeedback('Incorrect. Try again!');
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      generateQuestion(flashcards);
    }, 1000); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentQuestion) {
    return <div>No flashcards found.</div>;
  }

  return (
    <div>
      <h1>Learn</h1>
      <p>{currentQuestion.question}</p>
      {options.map((option, index) => (
        <Button key={index} onClick={() => handleClick(option)}>
          {option}
        </Button>
      ))}
      {feedback && <p>{feedback}</p>}
    </div>
  );
}
