import { useLoaderData, Link } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

type Home = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

import { getAllDivision } from '~/lib/services/division.server';

export async function loader() {
  const { divisions } = await getAllDivision();
  return { divisions };
}

const columns: ColumnDef<Home>[] = [
  { accessorKey: 'name', header: 'Name' },
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
        <Link to={`/divisions/${props.row.original.id}`}>Detail</Link>
      </Button>
    ),
  },
];

export default function DivisionList() {
  const { divisions } = useLoaderData<typeof loader>();
  return (
    <div className="px-4 py-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Divisions</h2>
        <Button size="sm" asChild>
          <Link to="/divisions/new">
            <Plus /> New Division
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={divisions} showSearchBar searchBy="name" />
    </div>
  );
}
