'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { getAllFlashcards, updateFlashcard, deleteFlashcard } from '@/actions/api/flashcards/route';
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
import { DialogDemo } from '@/components/shadcn/dialog-create';
import { DialogUpdate } from '@/components/shadcn/dialog-update';

export type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

export default function DataTableDemo({ set_id }: { set_id: number }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [refetchTrigger, setRefetchTrigger] = useState(false); // State to trigger refetch

  const handleUpdate = async (id: number, question: string, answer: string) => {
    try {
      await updateFlashcard(id, question, answer);
      setRefetchTrigger(prev => !prev); // Trigger a refetch of the data
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFlashcard(id);
      setRefetchTrigger(prev => !prev); // Trigger a refetch of the data
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

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

  const columns: ColumnDef<Flashcard>[] = [
    {
      accessorKey: 'question',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-orange-600"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-orange-800">{row.getValue('question')}</div>,
    },
    {
      accessorKey: 'answer',
      header: () => <div className="text-right text-orange-600">Answer</div>,
      cell: ({ row }) => <div className="text-right font-medium text-orange-800">{row.getValue('answer')}</div>,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <DialogUpdate flashcard={row.original} onUpdate={handleUpdate} />
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

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
    <div className="w-full max-w-7xl mx-auto px-8">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter questions..."
          value={(table.getColumn('question')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('question')?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-orange-600 focus:border-orange-800"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-100">
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
      <div className="rounded-md border border-orange-600">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-orange-600 text-white">
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
                    <TableCell key={cell.id} className="border-t border-orange-200">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <div className="flex justify-end space-x-4 mt-4">
        <Link href={`${set_id}/practice-set/${set_id}`}>
          <Button className="bg-orange-600 text-white hover:bg-orange-700">Flashcards</Button>
        </Link>
        <Link href={`${set_id}/learn/${set_id}`}>
          <Button className="bg-orange-600 text-white hover:bg-orange-700">Learn</Button>
        </Link>
      </div>
      <DialogDemo set_id={set_id} onFlashcardAdded={handleFlashcardAdded} />
    </div>
  );
}
