'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface CarouselDemoProps {
  flashcards: { question: string; answer: string }[];
}

export default function CarouselDemo({ flashcards }: CarouselDemoProps) {
  const [flipped, setFlipped] = useState<boolean[]>(Array(flashcards.length).fill(false));

  const handleFlip = (index: number) => {
    setFlipped(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  return (
    <Carousel className="w-full max-w-lg mx-auto my-8">
      <CarouselContent>
        {flashcards.map((flashcard, index) => (
          <CarouselItem key={index}>
            <div className="p-4">
              <Card 
                onClick={() => handleFlip(index)}
                className="cursor-pointer transition-transform transform hover:scale-105 bg-orange-500 text-white"
              >
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <h1 className="text-lg font-semibold">
                    {flipped[index] ? flashcard.answer : flashcard.question}
                  </h1>
                </CardContent>
              </Card>
              <h3 className="text-center text-orange-700 mt-2">{index + 1} of {flashcards.length}</h3>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-between mt-4">
        <CarouselPrevious className="bg-orange-600 text-white p-2 rounded hover:bg-orange-700" />
        <CarouselNext className="bg-orange-600 text-white p-2 rounded hover:bg-orange-700" />
      </div>
    </Carousel>
  );
}
