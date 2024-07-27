import { HoverEffect } from "@/components/acertenity/card-hover";

interface CardSetDemoProps {
    set_name: {set_name:string}[];
  }
export function CardHoverEffectDemo({set_name}: CardSetDemoProps) {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect set_name={set_name} />
    </div>
  );
}

