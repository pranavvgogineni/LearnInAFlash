import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { createFlashcard } from '@/actions/api/flashcards/route'; // Ensure the correct import path

export function DialogDemo({ onFlashcardAdded }: { onFlashcardAdded: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [set_id, setSetId] = React.useState(1);
  const [answer, setAnswer] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    await createFlashcard(question, answer, set_id); // Ensure the correct arguments are passed

    setOpen(false);
    onFlashcardAdded(); // Trigger the refetch
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Flashcard</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Flashcard</DialogTitle>
          <DialogDescription>
            Add a new flashcard to your study set
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question" className="text-right">
                Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="answer" className="text-right">
                Answer
              </Label>
              <Input
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="set_id" className="text-right">
                Set ID
              </Label>
              <Input
                id="set_id"
                value={set_id}
                onChange={(e) => setSetId(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add to Set</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
