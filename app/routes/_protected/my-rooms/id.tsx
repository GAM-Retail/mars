import { data, useLoaderData } from 'react-router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MapPin, Users, User, Wrench, CalendarPlus } from 'lucide-react';

import { getRoomById, isPersonInCharge } from '~/lib/services/room.server';
import { getReservationsByRoomId } from '~/lib/services/reservation.server';
import { getCurrentUser } from '~/lib/current-user.server';

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (user.role !== 'SUPERADMIN') {
    const isPic = await isPersonInCharge(user, params.id);
    if (!isPic)
      throw data(
        {
          message: 'You are not the person in charge for this room',
          label: 'My Rooms',
          href: '/my-rooms',
        },
        {
          status: 403,
          statusText: 'Forbidden',
        },
      );
  }
  const { room } = await getRoomById(params.id);
  const reservations = await getReservationsByRoomId(params.id);
  return { room, reservations };
}

type Reservation = {
  id: string;
  startTime: Date;
  endTime: Date;
  agenda: string | null;
  organizer: { name: string; email: string };
  reservedBy: { name: string; email: string };
};

const reservationColumns: ColumnDef<Reservation>[] = [
  {
    accessorKey: 'startTime',
    header: 'Date & Time',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>
          {new Date(row.original.startTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.startTime), 'HH:mm')} -{' '}
          {format(new Date(row.original.endTime), 'HH:mm')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'agenda',
    header: 'Agenda',
    cell: ({ row }) => <span>{row.original.agenda || '-'}</span>,
  },
  {
    accessorKey: 'organizer',
    header: 'Organizer',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.organizer.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.organizer.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'reservedBy',
    header: 'Reserved By',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.reservedBy.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.reservedBy.email}</span>
      </div>
    ),
  },
];

export default function MyRoomDetails() {
  const { room, reservations } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 py-2  space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{room?.name}</h2>
        <p className="text-muted-foreground">{room?.description || 'No description'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 text-muted-foreground" />
          <span>{room?.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="size-4 text-muted-foreground" />
          <span>Capacity: {room?.capacity} people</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarPlus className="size-4 text-muted-foreground" />
          <span>
            Created:{' '}
            {room?.createdAt
              ? new Date(room.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '-'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="size-4 text-muted-foreground" />
          <span>Created by: {room?.createdByUser?.name || 'System'}</span>
        </div>
      </div>

      {room?.roomPersonInCharges && room.roomPersonInCharges.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Person in Charge</h3>
          <div className="flex flex-wrap gap-2">
            {room.roomPersonInCharges.map(
              (pic: { personInCharge: { id: string; name: string } }) => (
                <div
                  key={pic.personInCharge.id}
                  className="flex items-center gap-1 text-sm bg-background px-2 py-1 rounded border"
                >
                  <User className="size-4 text-muted-foreground" />
                  <span>{pic.personInCharge.name}</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {room?.roomFacilities && room.roomFacilities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {room.roomFacilities.map((rf: { facility: { id: string; name: string } }) => (
              <div
                key={rf.facility.id}
                className="flex items-center gap-1 text-sm bg-background px-2 py-1 rounded border"
              >
                <Wrench className="size-4 text-muted-foreground" />
                <span>{rf.facility.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr />

      <div>
        <h3 className="text-lg font-semibold mb-4">Reservations</h3>
        <DataTable
          showSearchBar
          searchBy="agenda"
          searchPlaceholder="Search by agenda"
          columns={reservationColumns}
          data={reservations ?? []}
        />
      </div>
    </div>
  );
}
