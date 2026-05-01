import { FilterFn } from '@tanstack/solid-table';
declare module '@tanstack/solid-table' {
  interface FilterFns {
    dateRange: FilterFn<unknown>;
  }
}
