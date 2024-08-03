import Learn from "@/components/page/learn";

interface LearnPageProps {
  params: {
    id: number;
  };
}

export default function LearnPage({ params }: LearnPageProps) {
  const { id } = params;

  return <Learn set_id={Number(id)} />;
}
