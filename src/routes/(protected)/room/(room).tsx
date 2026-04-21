import { DataTable } from '~/components/DataTable';
import { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { createAsync, RouteDefinition } from '@solidjs/router';
import { Room as RoomType } from '~/generated/prisma/client';
import { getAllRooms } from '~/server/controller/room.server';

const columns: ColumnDef<RoomType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
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
    title: 'Room',
    description: 'Manage rooms',
    breadcrumb: {
      href: '/room',
      label: 'Room',
    },
    newButtonState: {
      label: 'New Room',
      href: '/room/new',
    },
  },
} satisfies RouteDefinition;
export default function Room() {
  const rooms = createAsync(() => getAllRooms());
  return (
    <div class="px-4 py-2 bg-secondary">
      <h2 class="text-2xl font-semibold">List Rooms</h2>
      <DataTable
        showSearchBar
        searchBy="name"
        columns={columns}
        data={rooms()?.data?.rooms ?? []}
      />
    </div>
  );
}
