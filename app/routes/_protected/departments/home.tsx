import { Link, useLoaderData } from 'react-router';
import { DataTable } from '~/components/DataTable';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import type { ColumnDef } from '@tanstack/react-table';
import type { DepartmentModel } from '~/generated/prisma/models';

import { getAllDepartment } from '~/lib/services/department.server';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

export async function loader() {
  const data = await getAllDepartment();
  return { departments: data.departments };
}

const columns: ColumnDef<DepartmentModel>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <TableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString('id-ID'),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <TableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleString('id-ID'),
  },
  {
    id: 'actions',
    cell: ({ row }) => <TableRowActions row={row} />,
  },
];

export default function DepartmentList() {
  const { departments } = useLoaderData<typeof loader>();
  return (
    <div className="px-4 py-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Department</h2>
        <Button size="sm" asChild>
          <Link to="/departments/new">
            <Plus /> New Department
          </Link>
        </Button>
      </div>
      <DataTable showSearchBar searchBy="name" columns={columns} data={departments} />
    </div>
  );
}
