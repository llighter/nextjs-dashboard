import { Payment, columns } from './columns';
import { DataTable } from './data-table';
import { lusitana } from '@/app/ui/fonts';

async function getData(): Promise<Payment[]> {
  return [
    {
      id: '1',
      amount: 100,
      status: 'success',
      email: 'm@example.com',
    },
    {
      id: '2',
      amount: 4500,
      status: 'processing',
      email: 'm223@example.com',
    },
  ];
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transactions</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
