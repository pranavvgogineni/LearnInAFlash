'use client';
import {Button} from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { getFlashcard } from '@/actions/api/flashcards/route';


let isAnswer = "Lebron James";
const handleClick = () => {
    isAnswer ? console.log('You clicked me!'): console.log('You did not click me!');
}
interface FlashcardProps {
    set_id: number;
    id: number;
  }

export default function Learn({set_id, id}: FlashcardProps) {
    const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[] | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFlashcard = async () => {
          const result = await getFlashcard(Number(set_id), Number(id));
          setFlashcards(result as { question: string; answer: string }[] | null);
          setLoading(false);
        };
    
        fetchFlashcard();
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