import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-orange-600">
      <h1 className="text-5xl font-bold mb-4">LearnInaFlash</h1>
      <p className="text-lg mb-8">Explore your sets</p>
      <Link href="sets">
        <Button className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded">
          View your sets
        </Button>
      </Link>
    </div>
  );
}
