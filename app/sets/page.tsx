'use client';
import { useState, useEffect } from 'react';
import { getAllSets } from '@/actions/api/sets/route';
import { CardHoverEffectDemo } from '@/components/page/set-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SetPage() {
  const [sets, setSets] = useState<{ set_name: string, id: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      const result = await getAllSets();
      setSets(result || []);
      setLoading(false);
    };

    fetchSets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sets</h1>
      <CardHoverEffectDemo set_name={sets} />
      <Link href="list">
        <Button>BACK TO SET</Button>
      </Link>
    </div>
  );
}
