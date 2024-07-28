import DataTableDemo from '@/components/shadcn/datatable';
export default function FlashcardsListPage({ params }: { params: { id: string } }) {
  return <DataTableDemo set_id={Number(params.id)} />;
}
