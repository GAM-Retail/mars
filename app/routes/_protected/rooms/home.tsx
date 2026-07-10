import { useLoaderData, Link } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

type Home = {
  id: string;
  name: string;
  description: string | null;
  location: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
};

import { getAllRooms } from '~/lib/services/room.server';

export async function loader() {
  const { rooms } = await getAllRooms();
  return { rooms };
}

const columns: ColumnDef<Home>[] = [
  { accessorKey: 'id', header: 'Id' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'location', header: 'Location' },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: (props) => (
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/rooms/${props.row.original.id}`}>Detail</Link>
      </Button>
    ),
  },
];

export default function RoomList() {
  const { rooms } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 py-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">List Rooms</h2>
        <Button size="sm" asChild>
          <Link to="/rooms/new">
            <Plus /> New Room
          </Link>
        </Button>
      </div>
      <DataTable showSearchBar searchBy="name" columns={columns} data={rooms ?? []} />
    </div>
  );
}
