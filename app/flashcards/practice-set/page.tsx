'use client';
import { useState, useEffect } from 'react';
import FlashCards from '@/components/flashcards/flashcard';
import CarouselDemo from '@/components/shadcn/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FlashCardPage() {
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const result = await FlashCards();
      setFlashcards(result || []);
      setLoading(false);
    };

    fetchFlashcards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Flashcards</h1>
      <CarouselDemo flashcards={flashcards} />
      <Link href="list">
            <Button>BACK TO SET</Button>
      </Link>
    </div>
  );
}
