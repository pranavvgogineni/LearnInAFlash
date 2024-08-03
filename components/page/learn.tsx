'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getAllFlashcards, updateFlashcardLevel } from '@/actions/api/flashcards/route';

interface Flashcard {
  id: number;
  set_id: number;
  question: string;
  answer: string;
  level: number;
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
  const [shouldGenerate, setShouldGenerate] = useState<boolean>(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const result = await getAllFlashcards(set_id);
      setFlashcards(result || []);
      setLoading(false);
    };

    fetchFlashcards();
  }, [set_id]);

  useEffect(() => {
    if (flashcards.length > 0 && shouldGenerate) {
      generateQuestion(flashcards);
      setShouldGenerate(false);
    }
  }, [flashcards, shouldGenerate]);

  const generateQuestion = (flashcards: Flashcard[]) => {
    const level1Questions = flashcards.filter(flashcard => flashcard.level === 1);
    const level2Questions = flashcards.filter(flashcard => flashcard.level === 2);

    const questionsToChooseFrom = level1Questions.length > 0 ? level1Questions : level2Questions;

    if (questionsToChooseFrom.length === 0) {
      setCurrentQuestion(null);
      setOptions([]);
      return;
    }

    const questionIndex = Math.floor(Math.random() * questionsToChooseFrom.length);
    const question = questionsToChooseFrom[questionIndex];

    generateOptions(question, flashcards);
    setCurrentQuestion(question);
  };

  const generateOptions = (question: Flashcard, flashcards: Flashcard[]) => {
    const distractors = flashcards
      .filter(flashcard => flashcard.id !== question.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(flashcard => flashcard.answer);

    const optionsSet = new Set([question.answer, ...distractors]);
    while (optionsSet.size < 4) {
      optionsSet.add(flashcards[Math.floor(Math.random() * flashcards.length)].answer);
    }
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    setOptions(options);
  };

  const handleOptionClick = async (answer: string) => {
    const isCorrect = answer === currentQuestion?.answer;
    setMessage(isCorrect ? 'Correct!' : 'Incorrect, try again!');
    if (isCorrect && currentQuestion) {
      await updateFlashcardLevel(currentQuestion.id, currentQuestion.level + 1);
      const updatedFlashcards = flashcards.map(flashcard =>
        flashcard.id === currentQuestion.id
          ? { ...flashcard, level: currentQuestion.level + 1 }
          : flashcard
      );
      setFlashcards(updatedFlashcards);
      setTimeout(() => {
        setMessage('');
        setShouldGenerate(true);
      }, 1000);
    }
  };

  const handleInputSubmit = async () => {
    const isCorrect = userInput === currentQuestion?.answer;
    setMessage(isCorrect ? 'Correct!' : 'Incorrect, try again!');
    if (isCorrect && currentQuestion) {
      await updateFlashcardLevel(currentQuestion.id, currentQuestion.level + 1);
      const updatedFlashcards = flashcards.map(flashcard =>
        flashcard.id === currentQuestion.id
          ? { ...flashcard, level: currentQuestion.level + 1 }
          : flashcard
      );
      setFlashcards(updatedFlashcards);
      setTimeout(() => {
        setMessage('');
        setShouldGenerate(true);
        setUserInput('');
      }, 1000);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentQuestion) {
    return <div>No flashcards found or all flashcards are at level 3.</div>;
  }

  return (
    <div>
      <h1>Learn</h1>
      <p>{currentQuestion.question}</p>
      {currentQuestion.level === 1 && (
        <div>
          <h2>Multiple Choice</h2>
          {options.map((option, index) => (
            <Button key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </Button>
          ))}
        </div>
      )}
      {currentQuestion.level === 2 && (
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
      )}
      <p>{message}</p>
    </div>
  );
}
