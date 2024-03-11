import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalPages: number;
}

export function DataTablePagination<TData>({
  table,
  totalPages,
}: DataTablePaginationProps<TData>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  const createPageURL = (
    pageNumber: number | string,
    pageSize?: number | string,
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    if (pageSize) {
      params.set('pageSize', pageSize.toString());
    }
    return `${pathname}?${params.toString()}`;
  };
  const { push } = useRouter();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-5 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value);
              const newUrl = createPageURL(1, newPageSize);
              push(newUrl);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <PaginationArrow
            direction="double left"
            href={createPageURL(1)}
            isDisabled={currentPage <= 1}
          />
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
          <PaginationArrow
            direction="double right"
            href={createPageURL(totalPages)}
            isDisabled={currentPage >= totalPages}
          />
        </div>
      </div>
    </div>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'double left' | 'right' | 'double right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
    },
  );

  const icon = getIcon(direction);

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

function getIcon(direction: string) {
  switch (direction) {
    case 'double left':
      return <DoubleArrowLeftIcon className="h-4 w-4" />;
    case 'double right':
      return <DoubleArrowRightIcon className="h-4 w-4" />;
    case 'left':
      return <ChevronLeftIcon className="h-4 w-4" />;
    case 'right':
      return <ChevronRightIcon className="h-4 w-4" />;
  }
}
