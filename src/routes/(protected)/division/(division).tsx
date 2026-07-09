import { DataTable } from '~/components/DataTable';
import { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { createAsync, RouteDefinition } from '@solidjs/router';
import { getAllDivision } from '~/server/controller/division.server';
import type { DivisionModel } from '~/generated/prisma/models';
import { UserRole } from '~/types';
import { Suspense } from 'solid-js';
import Loading from '~/components/Loading';

const columns: ColumnDef<DivisionModel>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: (props) => <TableColumnHeader column={props.column} title="Name" />,
  },
  {
    accessorKey: 'createdAt',
    header: (props) => <TableColumnHeader column={props.column} title="Created At" />,
  },
  {
    accessorKey: 'updatedAt',
    header: (props) => <TableColumnHeader column={props.column} title="Updated At" />,
  },
  {
    id: 'actions',
    cell: (props) => <TableRowActions row={props.row} />,
  },
];

export const route = {
  info: {
    title: 'Division',
    description: 'Manage divisions',
    breadcrumb: {
      href: '/division',
      label: 'Division',
    },
    newButtonState: {
      label: 'New Division',
      href: '/division/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function Division() {
  const divisions = createAsync(() => getAllDivision());
  return (
    <Suspense fallback={<Loading />}>
      <div class="px-4 py-2 bg-secondary">
        <h2 class="text-2xl font-semibold">List Division</h2>
        <DataTable
          showSearchBar
          searchBy="name"
          columns={columns}
          data={divisions()?.divisions ?? []}
        />
      </div>
    </Suspense>
  );
}
