import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function HomePage()  {
  return (
    <div>
      <h1>LearnInaFlash</h1>
      <p>Explore your sets</p>
      <Link href="sets">
        <Button>View your sets</Button>
      </Link>
    </div>
  );
}