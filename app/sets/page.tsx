'use client';
import { useState, useEffect } from 'react';
import { getAllSets, createSet } from '@/actions/api/sets/route';
import { CardHoverEffectDemo } from '@/components/page/set-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DialogCreateSet } from '@/components/shadcn/dialog-create-set'; // Ensure the correct import path

export default function SetPage() {
  const [sets, setSets] = useState<{ set_name: string, id: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false); // State to trigger refetch

  useEffect(() => {
    const fetchSets = async () => {
      const result = await getAllSets();
      setSets(result || []);
      setLoading(false);
    };

    fetchSets();
  }, [refetchTrigger]);

  const handleCreateSet = async (setName: string) => {
    try {
      await createSet(setName);
      setRefetchTrigger(prev => !prev); // Trigger a refetch of the sets
    } catch (error) {
      console.error('Error creating set:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sets</h1>
      <CardHoverEffectDemo set_name={sets} />
      <DialogCreateSet onCreate={handleCreateSet} />
      <Link href="list">
        <Button>BACK TO SET</Button>
      </Link>
    </div>
  );
}
