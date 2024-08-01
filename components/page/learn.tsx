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
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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
  };

  const handleOptionClick = (answer: string) => {
    setMessage(answer === currentQuestion?.answer ? 'Correct!' : 'Incorrect, try again!');
  };

  const handleInputSubmit = () => {
    setMessage(userInput === currentQuestion?.answer ? 'Correct!' : 'Incorrect, try again!');
    setUserInput('');
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
      <div>
        <h2>Multiple Choice</h2>
        {options.map((option, index) => (
          <Button key={index} onClick={() => handleOptionClick(option)}>
            {option}
          </Button>
        ))}
      </div>
      <div>
        <h2>Type Your Answer</h2>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer"
        />
        <Button onClick={handleInputSubmit}>Submit</Button>
      </div>
      <p>{message}</p>
    </div>
  );
}
