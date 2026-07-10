import { useLoaderData, Link } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

type Home = {
  id: string;
  nik: string;
  name: string;
  email: string;
  role: string;
  ext: string | null;
  createdAt: Date;
};

import { requireSuperAdmin } from '~/lib/current-user.server';
import db from '~/lib/db';

export async function loader({ request }: { request: Request }) {
  await requireSuperAdmin(request);
  const users = await db.user.findMany({
    select: {
      id: true,
      nik: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ext: true,
      division: true,
      department: true,
    },
    orderBy: { name: 'asc' },
  });
  return { users };
}

const columns: ColumnDef<Home>[] = [
  { accessorKey: 'id', header: 'Id' },
  { accessorKey: 'nik', header: 'NIK' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: (props) => (
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/users/${props.row.original.id}`}>Detail</Link>
      </Button>
    ),
  },
];

export default function UserList() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 py-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">List Users</h2>
        <Button size="sm" asChild>
          <Link to="/users/new">
            <Plus /> New User
          </Link>
        </Button>
      </div>
      <DataTable showSearchBar searchBy="name" columns={columns} data={users ?? []} />
    </div>
  );
}
