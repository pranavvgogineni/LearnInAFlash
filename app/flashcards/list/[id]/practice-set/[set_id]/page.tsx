import FlashCardPage from '@/components/page/flashcard';

interface FlashCardListProps {
  params: {
    id: string;
  };
}

export default function FlashCardList({ params }: FlashCardListProps) {
  const { id } = params;

  return <FlashCardPage set_id={Number(id)} />;
}
