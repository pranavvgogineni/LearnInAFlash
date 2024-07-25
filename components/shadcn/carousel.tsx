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
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {flashcards.map((flashcard, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card onClick={() => handleFlip(index)}>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <h1 className="text-md font-semibold">
                    {flipped[index] ? flashcard.answer : flashcard.question}
                  </h1>
                </CardContent>
              </Card>
              <h3>{index + 1} of {flashcards.length}</h3>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
