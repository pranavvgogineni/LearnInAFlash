import Learn from "@/components/page/learn";

interface LearnPageProps {
  params: {
    id: string;
  };
}

export default function LearnPage({ params }: LearnPageProps) {
  const { id } = params;

  console.log(`LearnPage for set_id: ${id}`);

  return <Learn set_id={Number(id)} />;
}
