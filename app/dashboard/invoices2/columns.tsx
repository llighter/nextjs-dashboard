'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { InvoicesTable } from '@/app/lib/definitions';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import Image from 'next/image';
import InvoiceStatus from '@/app/ui/invoices/status';
import { useRouter } from 'next/navigation';
import { DeleteInvoice } from '@/app/ui/invoices/buttons';
import { deleteInvoice } from '@/app/lib/action';

// TODO: zod로 업데이트

export const columns: ColumnDef<InvoicesTable>[] = [
  {
    id: 'selection',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Image
            src={row.original.image_url}
            className="rounded-full"
            width={28}
            height={28}
            alt={`${row.getValue('name')}'s profile picture`}
          />
          <p>{row.getValue('name')}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return formatCurrency(row.getValue('amount'));
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return formatDateToLocal(row.getValue('date'));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <InvoiceStatus status={row.getValue('status')} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;
      const { push } = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => push(`/dashboard/invoices/${payment.id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                const deleteInvoiceWithId = deleteInvoice.bind(
                  null,
                  payment.id,
                );

                await deleteInvoiceWithId();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
