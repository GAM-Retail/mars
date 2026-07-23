import { useLoaderData, Link } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { TableRowActions } from '~/components/ui/table-row-actions';
import RoomsFilter from '~/components/RoomsFilter';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '~/lib/utils';

type ReservationRow = {
  id: string;
  roomId: string;
  roomName: string;
  organizerName: string;
  organizerNik: string;
  startTime: Date;
  endTime: Date;
  reservedByName: string;
  agenda: string | null;
  deletedAt: Date | null;
};

import { requireAdminOrSuperAdmin } from '~/lib/current-user.server';
import {
  getReservationsByPersonInCharge,
  getReservationsByRoomIds,
  reservationMapper,
} from '~/lib/services/reservation.server';
import { getAllRoomsData, getRoomsByPersonInChargeQuery } from '~/lib/services/room.server';
import { Room } from '~/generated/prisma/client';

export async function loader({ request }: { request: Request }) {
  const user = await requireAdminOrSuperAdmin(request);
  const [reservationsData, rooms] = await Promise.all([
    user.role === 'SUPERADMIN'
      ? getReservationsByRoomIds('all')
      : getReservationsByPersonInCharge(user),
    user.role === 'SUPERADMIN' ? getAllRoomsData() : getRoomsByPersonInChargeQuery(user.id),
  ]);

  const reservations = reservationsData.map(reservationMapper);
  return { reservations, rooms };
}

const isDeleted = (row: Row<ReservationRow>) => !!row.original.deletedAt;

const columns: ColumnDef<ReservationRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'roomName',
    header: 'Room Name',
    cell: (props) => (
      <span className={cn(isDeleted(props.row) && 'line-through text-muted-foreground')}>
        {props.row.original.roomName}
      </span>
    ),
  },
  {
    accessorKey: 'organizerName',
    header: 'Organizer',
    cell: (props) => (
      <div className="flex flex-col">
        <span
          className={cn(
            'font-medium',
            isDeleted(props.row) && 'line-through text-muted-foreground',
          )}
        >
          {props.row.original.organizerName}
        </span>
        <span
          className={cn(
            'text-xs',
            isDeleted(props.row) ? 'text-muted-foreground line-through' : 'text-muted-foreground',
          )}
        >
          {props.row.original.organizerNik}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'startTime',
    header: (props) => <TableColumnHeader column={props.column} title="Date" />,
    filterFn: 'dateRange',
    cell: (props) => (
      <div className="flex flex-col">
        <span className={cn(isDeleted(props.row) && 'line-through text-muted-foreground')}>
          {new Date(props.row.original.startTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <span
          className={cn(
            'text-xs',
            isDeleted(props.row) ? 'text-muted-foreground line-through' : 'text-muted-foreground',
          )}
        >
          {new Date(props.row.original.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' - '}
          {new Date(props.row.original.endTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'reservedByName',
    header: 'Reserved By',
    cell: (props) => (
      <span className={cn(isDeleted(props.row) && 'line-through text-muted-foreground')}>
        {props.row.original.reservedByName}
      </span>
    ),
  },
  {
    accessorKey: 'agenda',
    header: 'Agenda',
    cell: (props) => (
      <span className={cn('text-sm', isDeleted(props.row) && 'line-through text-muted-foreground')}>
        {props.row.original.agenda || '-'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: (props) => <TableRowActions row={props.row} />,
  },
];

export default function ReservationList() {
  const { reservations, rooms } = useLoaderData<typeof loader>() as {
    reservations: ReservationRow[];
    rooms: Room[];
  };
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    rooms.map((r: { id: string }) => r.id),
  );
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const filteredReservations = reservations.filter((r) => {
    if (!includeDeleted && r.deletedAt) return false;
    return !(selectedRooms.length > 0 && !selectedRooms.includes(r.roomId));
  });

  return (
    <div className="px-4 py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Room Reservations</h2>
        <div className="ml-auto flex items-center gap-2">
          {rooms.length > 0 && (
            <RoomsFilter
              selectedRooms={selectedRooms}
              data={rooms}
              setSelectedRooms={setSelectedRooms}
            />
          )}
          <Button size="sm" asChild>
            <Link to="/reservations/new">
              <Plus /> New Reservation
            </Link>
          </Button>
        </div>
      </div>
      <DataTable
        showSearchBar
        searchBy="organizerName"
        searchPlaceholder="Search by organizer name"
        showDateFilter
        dateFilterBy="startTime"
        columns={columns}
        data={filteredReservations}
      />
      <label className="flex items-center gap-2 mt-4 text-sm text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />{' '}
        Show deleted reservations
      </label>
    </div>
  );
}
