import { Link, useLoaderData } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import type { FacilityModel } from '~/generated/prisma/models';

import { getAllFacility } from '~/lib/services/facility.server';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

export async function loader() {
  const { facilities } = await getAllFacility();
  return { facilities };
}

const columns: ColumnDef<FacilityModel>[] = [
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
    accessorKey: 'createdAt',
    header: (props) => <TableColumnHeader column={props.column} title="Created At" />,
    cell: ({ row }) => row.original.createdAt.toLocaleString('id-ID'),
  },
  {
    accessorKey: 'updatedAt',
    header: (props) => <TableColumnHeader column={props.column} title="Updated At" />,
    cell: ({ row }) => row.original.updatedAt.toLocaleString('id-ID'),
  },
  {
    id: 'actions',
    cell: (props) => <TableRowActions row={props.row} />,
  },
];

export default function FacilityList() {
  const { facilities } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 py-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">List Facilities</h2>
        <Button size="sm" asChild>
          <Link to="/facilities/new">
            <Plus /> New Facility
          </Link>
        </Button>
      </div>
      <DataTable showSearchBar searchBy="name" columns={columns} data={facilities} />
    </div>
  );
}
