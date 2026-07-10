import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { TablePagination } from '~/components/ui/table-pagination';
import { DateFilter } from '~/components/ui/date-filter';

interface DateRangeFilter {
  from?: string;
  to?: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showSearchBar?: boolean;
  searchBy?: keyof TData;
  searchPlaceholder?: string;
  showDateFilter?: boolean;
  dateFilterBy?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showSearchBar,
  searchBy,
  searchPlaceholder,
  showDateFilter,
  dateFilterBy,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ id: false });
  const [rowSelection, setRowSelection] = useState({});

  const dateRangeFilterFn: FilterFn<TData> = (
    row,
    columnId,
    filterValue: DateRangeFilter | undefined,
  ) => {
    if (!filterValue || (!filterValue.from && !filterValue.to)) return true;
    const rowDate = row.getValue(columnId);
    if (!rowDate) return false;
    const rowTime = new Date(rowDate as Date).getTime();
    const fromTime = filterValue.from ? new Date(filterValue.from).getTime() : 0;
    const toTime = filterValue.to ? new Date(filterValue.to).getTime() + 86400000 : Infinity;
    return rowTime >= fromTime && rowTime <= toTime;
  };

  const handleDateFilterChange = (filter: { from?: string; to?: string } | undefined) => {
    if (!dateFilterBy) return;
    if (!filter?.from && !filter?.to) {
      table.getColumn(dateFilterBy)?.setFilterValue(undefined);
    } else {
      table.getColumn(dateFilterBy)?.setFilterValue(filter);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: { dateRange: dateRangeFilterFn },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 py-4">
        {showSearchBar && searchBy && (
          <Input
            placeholder={searchPlaceholder ?? `Search by ${String(searchBy)}`}
            value={(table.getColumn(String(searchBy))?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn(String(searchBy))?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
        )}
        <div className="flex items-center gap-4">
          {showDateFilter && dateFilterBy && (
            <DateFilter columnId={dateFilterBy} onFilterChange={handleDateFilterChange} />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Columns <ChevronDown />
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
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="min-h-100">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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
      </div>
      <div className="py-2">
        <TablePagination table={table} />
      </div>
    </div>
  );
}
