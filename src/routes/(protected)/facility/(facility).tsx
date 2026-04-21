import { DataTable } from '~/components/DataTable';
import { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { createAsync, RouteDefinition } from '@solidjs/router';
import { getAllFacility } from '~/server/controller/facility.server';

type Facility = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

const columns: ColumnDef<Facility>[] = [
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
    title: 'Facility',
    description: 'Manage facilities',
    breadcrumb: {
      href: '/facility',
      label: 'Facility',
    },
    newButtonState: {
      label: 'New Facility',
      href: '/facility/new',
    },
  },
} satisfies RouteDefinition;
export default function Facility() {
  const facilities = createAsync(() => getAllFacility());
  return (
    <div class="px-4 py-2 bg-secondary">
      <h2 class="text-2xl font-semibold">List Facility</h2>
      <DataTable
        showSearchBar
        searchBy="name"
        columns={columns}
        data={facilities()?.data?.facilities ?? []}
      />
    </div>
  );
}
