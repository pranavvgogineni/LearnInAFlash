'use client';
import {Button} from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { getAllFlashcards } from '@/actions/api/flashcards/route';


let isAnswer = "Lebron James";
const handleClick = () => {
    isAnswer ? console.log('You clicked me!'): console.log('You did not click me!');
}
interface FlashcardProps {
    set_id: number;
  }

export default function Learn(set_id: FlashcardProps) {
    const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFlashcards = async () => {
          const result = await getAllFlashcards(Number(set_id));
          setFlashcards(result || []);
          setLoading(false);
        };
    
        fetchFlashcards();
      }, [set_id]);
    return (
        <div>
        <h1>Learn</h1>
        <p>Who is the GOAT of basketball?</p>
        <Button onClick={handleClick}>Lebron James</Button>
        <Button>Michael Jordan</Button>
        <Button>Stephen Curry</Button>
        <Button>Kobe Bryant</Button>
        </div>
    );
}