import { createAsync, type RouteDefinition } from '@solidjs/router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { UserRole } from '~/types';
import { getRoomsByPersonInCharge, getAllRooms } from '~/server/controller/room.server';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { Room } from '~/generated/prisma/client';

const columns: ColumnDef<Room>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'name',
    header: (props) => <TableColumnHeader column={props.column} title="Name" />,
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'capacity',
    header: (props) => <TableColumnHeader column={props.column} title="Capacity" />,
  },
  {
    accessorKey: 'createdAt',
    header: (props) => <TableColumnHeader column={props.column} title="Created At" />,
    cell: (props) => (
      <span>
        {props.row.original.createdAt.toLocaleString('id-ID', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: (props) => <TableColumnHeader column={props.column} title="Updated At" />,
    cell: (props) => (
      <span>
        {props.row.original.updatedAt.toLocaleString('id-ID', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: (props) => <TableRowActions row={props.row} detailUrl="/my-rooms" paramName="id" />,
  },
];

export const route = {
  info: {
    title: 'My Rooms',
    description: 'Rooms you are person in charge of',
    breadcrumb: { href: '/my-rooms', label: 'My Rooms' },
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function MyRoomsPage() {
  const userContext = useCurrentUser();
  const isSuperAdmin = () => userContext.currentUser?.role === UserRole.SUPERADMIN;

  const rooms = createAsync(async () => {
    if (isSuperAdmin()) {
      const result = await getAllRooms();
      return result.rooms;
    }
    return getRoomsByPersonInCharge();
  });

  const pageTitle = () => (isSuperAdmin() ? 'All Rooms' : 'My Rooms');

  return (
    <div class="px-4 py-2 bg-secondary">
      <h2 class="text-2xl font-semibold mb-4">{pageTitle()}</h2>
      <DataTable
        showSearchBar
        searchBy="name"
        searchPlaceholder="Search by room name"
        columns={columns}
        data={rooms() ?? []}
      />
    </div>
  );
}
