import { useState } from 'react';
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

interface DialogCreateSetProps {
  onCreate: (set_name: string) => void;
}

export function DialogCreateSet({ onCreate }: DialogCreateSetProps) {
  const [setName, setSetName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onCreate(setName);
    setSetName(''); // Clear the input after creating the set
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Set</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Set</DialogTitle>
          <DialogDescription>
            Enter the name of the new set below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="set_name" className="text-right">
              Set Name
            </Label>
            <Input
              id="set_name"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Create new set</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
