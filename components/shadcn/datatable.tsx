'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { getAllFlashcards } from '@/actions/api/flashcards/route';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DialogDemo } from '@/components/shadcn/dialog';

export type Flashcard = {
  question: string;
  answer: string;
};

export const columns: ColumnDef<Flashcard>[] = [
  {
    accessorKey: 'question',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Question
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('question')}</div>,
  },
  {
    accessorKey: 'answer',
    header: () => <div className="text-right">Answer</div>,
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue('answer')}</div>,
  },
];

export default function DataTableDemo({ set_id }: { set_id: number }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [refetchTrigger, setRefetchTrigger] = useState(false); // State to trigger refetch

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const result = await getAllFlashcards(set_id);
        setFlashcards(result || []);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    if (set_id) {
      fetchFlashcards();
    }
  }, [set_id, refetchTrigger]); // Refetch when refetchTrigger or set_id changes

  const handleFlashcardAdded = () => {
    setRefetchTrigger(!refetchTrigger); // Toggle the refetch trigger
  };

  const table = useReactTable({
    data: flashcards,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter questions..."
          value={(table.getColumn('question')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('question')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Link href={`${set_id}/practice-set/${set_id}`}>
        <Button>FLASHCARD</Button>
      </Link>
      <DialogDemo set_id={set_id} onFlashcardAdded={handleFlashcardAdded} />
    </div>
  );
}
