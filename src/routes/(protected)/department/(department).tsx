import { DataTable } from '~/components/DataTable';
import { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { createAsync, RouteDefinition } from '@solidjs/router';
import { getAllDepartment } from '~/server/controller/department.server';
import type { DepartmentModel } from '~/generated/prisma/models';
import { UserRole } from '~/types';
import { Suspense } from 'solid-js';
import Loading from '~/components/Loading';

const columns: ColumnDef<DepartmentModel>[] = [
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
    title: 'Department',
    description: 'Manage departments',
    breadcrumb: {
      href: '/department',
      label: 'Department',
    },
    newButtonState: {
      label: 'New Department',
      href: '/department/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function Department() {
  const departments = createAsync(() => getAllDepartment());
  return (
    <Suspense fallback={<Loading />}>
      <div class="px-4 py-2 bg-secondary">
        <h2 class="text-2xl font-semibold">List Department</h2>
        <DataTable
          showSearchBar
          searchBy="name"
          columns={columns}
          data={departments()?.departments ?? []}
        />
      </div>
    </Suspense>
  );
}
