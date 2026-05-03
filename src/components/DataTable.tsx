import { createSignal, For, Show } from 'solid-js';
import {
  ColumnDef,
  ColumnFiltersState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  FilterFn,
} from '@tanstack/solid-table';

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
import { TextField, TextFieldInput } from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';
import { ChevronDown } from 'lucide-solid';
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
  dateFilterPlaceholder?: string;
}

export function DataTable<TData, TValue>(props: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({
    id: false, // hide id column by default
  });
  const [rowSelection, setRowSelection] = createSignal({});

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
    if (!props.dateFilterBy) return;

    if (!filter?.from && !filter?.to) {
      table.getColumn(props.dateFilterBy)?.setFilterValue(undefined);
    } else {
      table.getColumn(props.dateFilterBy)?.setFilterValue(filter);
    }
  };

  const table = createSolidTable({
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      dateRange: dateRangeFilterFn,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
      get columnVisibility() {
        return columnVisibility();
      },
      get rowSelection() {
        return rowSelection();
      },
    },
  });

  return (
    <div class="w-full">
      <div class="flex items-center justify-between gap-4 py-4">
        <Show when={props.showSearchBar && props.searchBy}>
          <TextField
            value={(table.getColumn(String(props.searchBy))?.getFilterValue() as string) ?? ''}
            onChange={(value) => table.getColumn(String(props.searchBy))?.setFilterValue(value)}
          >
            <TextFieldInput
              placeholder={props.searchPlaceholder ?? `Search by ${String(props.searchBy)}`}
              class="max-w-sm"
            />
          </TextField>
        </Show>
        <div class="flex items-center gap-4">
          <Show when={props.showDateFilter && props.dateFilterBy}>
            <DateFilter
              columnId={props.dateFilterBy as string}
              onFilterChange={handleDateFilterChange}
            />
          </Show>
          <DropdownMenu placement="bottom-end">
            <DropdownMenuTrigger as={Button<'button'>} size="sm" variant="outline" class="ml-auto">
              Columns <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <For each={table.getAllColumns().filter((column) => column.getCanHide())}>
                {(column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      class="capitalize"
                      checked={column.getIsVisible()}
                      onChange={(value) => column.toggleVisibility(value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                }}
              </For>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="min-h-100">
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <TableRow>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <TableHead colSpan={header.colSpan}>
                          <Show when={!header.isPlaceholder}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Show>
                        </TableHead>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </TableHeader>
            <TableBody>
              <Show
                when={table.getRowModel().rows?.length}
                fallback={
                  <TableRow>
                    <TableCell colSpan={props.columns.length} class="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                }
              >
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <TableCell>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )}
                      </For>
                    </TableRow>
                  )}
                </For>
              </Show>
            </TableBody>
          </Table>
        </div>
      </div>
      <div class="py-2">
        <TablePagination table={table} />
      </div>
    </div>
  );
}
