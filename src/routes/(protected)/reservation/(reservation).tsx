import { createAsync, type RouteDefinition } from '@solidjs/router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef, Row } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import { getAllReservationsByPersonInChargeQuery } from '~/server/controller/reservation.server';
import { UserRole } from '~/types';
import { Show, createSignal, createEffect } from 'solid-js';
import RoomsFilter from '~/routes/(protected)/reservation/components/RoomsFilter';
import { getRoomsByPersonInCharge } from '~/server/controller/room.server';
import { cn } from '~/lib/utils';

const isDeleted = (
  row: Row<Awaited<ReturnType<typeof getAllReservationsByPersonInChargeQuery>>[number]>,
) => !!row.original.deletedAt;

const columns: ColumnDef<
  Awaited<ReturnType<typeof getAllReservationsByPersonInChargeQuery>>[number]
>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'roomName',
    header: 'Room',
    cell: (props) => (
      <span class={cn(isDeleted(props.row) && 'line-through text-muted-foreground')}>
        {props.row.original.roomName}
      </span>
    ),
  },
  {
    accessorKey: 'organizerName',
    header: 'Organizer',
    cell: (props) => (
      <div class="flex flex-col">
        {' '}
        <span
          class={cn('font-medium', isDeleted(props.row) && 'line-through text-muted-foreground')}
        >
          {props.row.original.organizerName}
        </span>{' '}
        <span
          class={cn(
            'text-xs',
            isDeleted(props.row) ? 'text-muted-foreground line-through' : 'text-muted-foreground',
          )}
        >
          {props.row.original.organizerNik}
        </span>{' '}
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
          <span class={cn(isDeleted(props.row) && 'line-through text-muted-foreground')}>
            {props.row.original.startTime.toLocaleString('id-ID', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>{' '}
          <span
            class={cn(
              'text-xs',
              isDeleted(props.row) ? 'text-muted-foreground line-through' : 'text-muted-foreground',
            )}
          >
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
    cell: (props) => (
      <span class={cn(isDeleted(props.row) && 'line-through text-muted-foreground')}>
        {props.row.original.reservedByName}
      </span>
    ),
  },
  {
    accessorKey: 'agenda',
    header: 'Agenda',
    cell: (props) => (
      <span class={cn('text-sm', isDeleted(props.row) && 'line-through text-muted-foreground')}>
        {props.row.original.agenda || '-'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: (props) => <TableRowActions row={props.row} />,
  },
];

export const route = {
  info: {
    title: 'Reservations',
    description: 'Manage room reservations',
    breadcrumb: { href: '/reservation', label: 'Reservations' },
    newButtonState: {
      label: 'New Reservation',
      href: '/reservation/new',
      role: [UserRole.ADMIN, UserRole.SUPERADMIN],
    },
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function ReservationPage() {
  const rooms = createAsync(() => getRoomsByPersonInCharge());
  const [selectedRooms, setSelectedRooms] = createSignal<string[]>([]);
  const [includeDeleted, setIncludeDeleted] = createSignal(false);

  createEffect(() => {
    const data = rooms();
    if (data) {
      setSelectedRooms(data.map((room) => room.id));
    }
  });
  const resource = createAsync(() =>
    getAllReservationsByPersonInChargeQuery(selectedRooms(), includeDeleted()),
  );
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
      <label class="flex items-center gap-2 mt-4 text-sm text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={includeDeleted()}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
          class="h-4 w-4 rounded border-gray-300"
        />{' '}
        Show deleted reservations
      </label>
    </div>
  );
}
