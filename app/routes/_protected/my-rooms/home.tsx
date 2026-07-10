import { useLoaderData, Link } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';

type Room = {
  id: string;
  name: string;
  description: string | null;
  location: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
};

import { getAllRoomsData, getRoomsByPersonInChargeQuery } from '~/lib/services/room.server';
import { getCurrentUser } from '~/lib/current-user.server';

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const isSuperAdmin = user.role === 'SUPERADMIN';
  if (isSuperAdmin) {
    const rooms = await getAllRoomsData();
    return { rooms, isSuperAdmin };
  }
  const rooms = await getRoomsByPersonInChargeQuery(user.id);
  return { rooms, isSuperAdmin };
}

const columns: ColumnDef<Room>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'capacity', header: 'Capacity' },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  },
  {
    id: 'actions',
    cell: (props) => (
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/my-rooms/${props.row.original.id}`}>Detail</Link>
      </Button>
    ),
  },
];

export default function Home() {
  const { rooms, isSuperAdmin } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 py-2">
      <h2 className="text-2xl font-semibold mb-4">{isSuperAdmin ? 'All Rooms' : 'My Rooms'}</h2>
      <DataTable
        showSearchBar
        searchBy="name"
        searchPlaceholder="Search by room name"
        columns={columns}
        data={rooms ?? []}
      />
    </div>
  );
}
