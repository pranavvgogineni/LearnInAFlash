'use client';

import { useState, useEffect } from 'react';
import { getAllFlashcards } from '@/actions/api/flashcards/route';
import CarouselDemo from '@/components/shadcn/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FlashcardProps {
  set_id: number;
}

export default function FlashCardPage({ set_id }: FlashcardProps) {
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const result = await getAllFlashcards(set_id);
      setFlashcards(result || []);
      setLoading(false);
    };

    fetchFlashcards();
  }, [set_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Flashcards</h1>
      <CarouselDemo flashcards={flashcards} />
      <Link href={`..`}>
        <Button>BACK TO SET</Button>
      </Link>
    </div>
  );
}
