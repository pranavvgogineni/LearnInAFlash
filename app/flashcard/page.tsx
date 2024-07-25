'use client';
import {useState, useEffect} from 'react';
import FlashCards from '@/components/flashcards/flashcard';


export default function FlashCardPage() {
    const [flipped, setFlipped] = useState(false);
    const [flashcards, setFlashcards] = useState<{ question: any; answer: any; }[] | null>(null);
    
    useEffect(() => {
        const fetchFlashcards = async () => {
            const result = await FlashCards();
            setFlashcards(result);
        };
    
        fetchFlashcards();
    }, []);
    
    if (flashcards === null) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h1>Flashcards</h1>
            <div>
                {flashcards.map((flashcard:any, index:any) => (
                    <div key={index} onClick={() => setFlipped(!flipped)}>
                        {flipped ? flashcard.answer : flashcard.question}
                    </div>
                ))}
            </div>
        </div>
    )

}