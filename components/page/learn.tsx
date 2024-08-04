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
      try {
        const result = await getAllFlashcards(set_id);
        console.log(`Fetched flashcards for set_id ${set_id}:`, result);
        setFlashcards(result || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
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
    return <div className="flex justify-center items-center h-screen text-orange-600">Loading...</div>;
  }

  if (!currentQuestion) {
    return <div className="flex justify-center items-center h-screen text-orange-600">No flashcards found or all flashcards are at level 3.</div>;
  }

  return (
    <div className="w-full h-full max-w-screen-xl max-h-screen mx-auto p-16 mt-8">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">Learn</h1>
      <p className="text-2xl text-center mb-6">{currentQuestion.question}</p>
      {currentQuestion.level === 1 && (
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Multiple Choice</h2>
          {options.map((option, index) => (
            <Button
              key={index}
              className="w-3/4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
      {currentQuestion.level === 2 && (
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Type Your Answer</h2>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer"
            className="w-3/4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded placeholder-white placeholder-opacity-75"
          />
          <Button className="w-3/4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded" onClick={handleInputSubmit}>
            Submit
          </Button>
        </div>
      )}
      <p className="text-center mt-6 text-2xl">{message}</p>
    </div>
  );
}
