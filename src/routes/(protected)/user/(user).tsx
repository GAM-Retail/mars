import { DataTable } from '~/components/DataTable';
import { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { createAsync, RouteDefinition } from '@solidjs/router';
import { User } from '~/generated/prisma/client';
import { getAllUsers } from '~/server/controller/user.server';
import { UserRole } from '~/types';

const columns: ColumnDef<Omit<User, 'password'>>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'nik',
    header: (props) => <TableColumnHeader column={props.column} title="NIK" />,
  },
  {
    accessorKey: 'name',
    header: (props) => <TableColumnHeader column={props.column} title="Name" />,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: (props) => <TableColumnHeader column={props.column} title="Role" />,
  },
  {
    accessorKey: 'createdAt',
    header: (props) => <TableColumnHeader column={props.column} title="Created At" />,
  },
  {
    id: 'actions',
    cell: (props) => <TableRowActions row={props.row} />,
  },
];

export const route = {
  info: {
    title: 'User',
    description: 'Manage users',
    breadcrumb: {
      href: '/user',
      label: 'User',
    },
    newButtonState: {
      label: 'New User',
      href: '/user/new',
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;
export default function UserPage() {
  const users = createAsync(() => getAllUsers());
  return (
    <div class="px-4 py-2 bg-secondary">
      <h2 class="text-2xl font-semibold">List Users</h2>
      <DataTable showSearchBar searchBy="name" columns={columns} data={users() ?? []} />
    </div>
  );
}
