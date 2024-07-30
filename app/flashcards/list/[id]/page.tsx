import DataTableDemo from '@/components/shadcn/datatable';
export default function FlashcardsListPage({ params }: { params: { id: number } }) {
  return <DataTableDemo set_id={(params.id)} />;
}
