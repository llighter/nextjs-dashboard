import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { DataTable } from './data-table';
import { columns } from './columns';

export const metadata: Metadata = {
  title: 'Invoices2',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;
  const totalPages = await fetchInvoicesPages(query, pageSize);
  const invoices = await fetchFilteredInvoices(query, currentPage, pageSize);

  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transactions</h1>
      </div>
      <DataTable columns={columns} data={invoices} totalPages={totalPages} />
    </div>
  );
}
