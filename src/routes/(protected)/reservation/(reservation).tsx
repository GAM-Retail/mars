import { createAsync, type RouteDefinition } from '@solidjs/router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { getAllReservationsByPersonInChargeQuery } from '~/server/controller/reservation.server';
import { UserRole } from '~/types';
import { Show, createSignal, createEffect } from 'solid-js';
import RoomsFilter from '~/routes/(protected)/reservation/components/RoomsFilter';
import { getRoomsByPersonInCharge } from '~/server/controller/room.server';

const columns: ColumnDef<
  Awaited<ReturnType<typeof getAllReservationsByPersonInChargeQuery>>[number]
>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'roomName',
    header: 'Room',
  },
  {
    accessorKey: 'organizerName',
    header: 'Organizer',
    cell: (props) => (
      <div class="flex flex-col">
        {' '}
        <span class="font-medium">{props.row.original.organizerName}</span>{' '}
        <span class="text-xs text-muted-foreground">{props.row.original.organizerNik}</span>{' '}
      </div>
    ),
  },
  {
    accessorKey: 'startTime',
    header: (props) => <TableColumnHeader column={props.column} title="Date" />,
    filterFn: 'dateRange',
    cell: (props) => (
      <Show when={props.row.original.startTime} fallback={<span>-</span>}>
        {' '}
        <div class="flex flex-col">
          {' '}
          <span>
            {props.row.original.startTime.toLocaleString('id-ID', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>{' '}
          <span class="text-xs text-muted-foreground">
            {props.row.original.startTime.toLocaleString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            -{' '}
            {props.row.original.endTime.toLocaleString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>{' '}
        </div>{' '}
      </Show>
    ),
  },
  {
    accessorKey: 'reservedByName',
    header: 'Reserved By',
  },
  {
    accessorKey: 'agenda',
    header: 'Agenda',
    cell: (props) => <span class="text-sm">{props.row.original.agenda || '-'}</span>,
  },
  { id: 'actions', cell: (props) => <TableRowActions row={props.row} /> },
];

export const route = {
  info: {
    title: 'Reservations',
    description: 'Manage room reservations',
    breadcrumb: { href: '/reservation', label: 'Reservations' },
    newButtonState: { label: 'New Reservation', href: '/reservation/new', role: [UserRole.ADMIN, UserRole.SUPERADMIN] },
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function ReservationPage() {
  const rooms = createAsync(() => getRoomsByPersonInCharge());
  const [selectedRooms, setSelectedRooms] = createSignal<string[]>([]);

  createEffect(() => {
    const data = rooms();
    if (data) {
      setSelectedRooms(data.map((room) => room.id));
    }
  });
  const resource = createAsync(() => getAllReservationsByPersonInChargeQuery(selectedRooms()));
  return (
    <div class="px-4 py-2 bg-secondary">
      <div class="flex flex-col sm:flex-row items-start sm:items-center">
        <h2 class="text-2xl font-semibold">Room Reservations</h2>
        <Show when={rooms()}>
          {(data) => (
            <RoomsFilter
              selectedRooms={selectedRooms()}
              data={data()}
              setSelectedRooms={setSelectedRooms}
            />
          )}
        </Show>
      </div>
      <Show when={resource()}>
        {(data) => (
          <DataTable
            showSearchBar
            searchBy="organizerName"
            searchPlaceholder="Search by organizer name"
            showDateFilter
            dateFilterBy="startTime"
            columns={columns}
            data={data()}
          />
        )}
      </Show>
    </div>
  );
}
