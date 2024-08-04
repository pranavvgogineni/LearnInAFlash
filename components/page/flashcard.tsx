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
    return <div className="flex justify-center items-center h-screen text-orange-600">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">Flashcards</h1>
      <CarouselDemo flashcards={flashcards} />
      <div className="flex justify-center mt-8">
        <Link href={`..`}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
            BACK TO SET
          </Button>
        </Link>
      </div>
    </div>
  );
}
