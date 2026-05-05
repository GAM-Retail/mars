import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { DataTable } from '~/components/DataTable';
import type { ColumnDef } from '@tanstack/solid-table';
import { TableColumnHeader } from '~/components/ui/table-column-header';
import { getRoomById } from '~/server/controller/room.server';
import { getReservationsByRoom } from '~/server/controller/reservation.server';
import { UserRole } from '~/types';
import { Show, For } from 'solid-js';
import { MapPin, Users, User, Wrench, CalendarPlus } from 'lucide-solid';
import { format } from 'date-fns';
import { Separator } from '~/components/ui/separator';

export const route = {
  info: {
    title: 'Room Detail',
    description: 'Room details and reservations',
    breadcrumb: { href: '/my-rooms', label: 'My Rooms' },
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

const reservationColumns: ColumnDef<Awaited<ReturnType<typeof getReservationsByRoom>>[number]>[] = [
  {
    accessorKey: 'startTime',
    header: (props) => <TableColumnHeader column={props.column} title="Date & Time" />,
    cell: (props) => (
      <Show when={props.row.original.startTime}>
        <div class="flex flex-col">
          <span>
            {props.row.original.startTime.toLocaleString('id-ID', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span class="text-xs text-muted-foreground">
            {format(props.row.original.startTime, 'HH:mm')} -{' '}
            {format(props.row.original.endTime, 'HH:mm')}
          </span>
        </div>
      </Show>
    ),
  },
  {
    accessorKey: 'agenda',
    header: 'Agenda',
    cell: (props) => <span>{props.row.original.agenda || '-'}</span>,
  },
  {
    accessorKey: 'organizer',
    header: 'Organizer',
    cell: (props) => (
      <div class="flex flex-col">
        <span class="font-medium">{props.row.original.organizer.name}</span>
        <span class="text-xs text-muted-foreground">{props.row.original.organizer.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'reservedBy',
    header: 'Reserved By',
    cell: (props) => (
      <div class="flex flex-col">
        <span class="font-medium">{props.row.original.reservedBy.name}</span>
        <span class="text-xs text-muted-foreground">{props.row.original.reservedBy.email}</span>
      </div>
    ),
  },
];

export default function MyRoomDetailPage() {
  const params = useParams<{ id: string }>();

  const data = createAsync(async () => {
    const [roomData, reservations] = await Promise.all([
      getRoomById(params.id),
      getReservationsByRoom(params.id),
    ]);
    return {
      room: roomData?.room,
      reservations,
    };
  });

  return (
    <div class="px-4 py-2 bg-secondary space-y-6">
      <Show when={data()}>
        {(d) => (
          <>
            <div>
              <h2 class="text-2xl font-semibold">{d().room?.name}</h2>
              <p class="text-muted-foreground">{d().room?.description || 'No description'}</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex items-center gap-2 text-sm">
                <MapPin class="size-4 text-muted-foreground" />
                <span>{d().room?.location}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <Users class="size-4 text-muted-foreground" />
                <span>Capacity: {d().room?.capacity} people</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <CalendarPlus class="size-4 text-muted-foreground" />
                <span>
                  Created:{' '}
                  {d().room?.createdAt
                    ? d().room.createdAt.toLocaleString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <User class="size-4 text-muted-foreground" />
                <span>Created by: {d().room?.createdByUser?.name || 'System'}</span>
              </div>
            </div>

            <Show when={d().room?.roomPersonInCharges && d().room.roomPersonInCharges.length > 0}>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-2">Person in Charge</h3>
                <div class="flex flex-wrap gap-2">
                  <For each={d().room?.roomPersonInCharges}>
                    {(pic) => (
                      <div class="flex items-center gap-1 text-sm bg-background px-2 py-1 rounded border">
                        <User class="size-4 text-muted-foreground" />
                        <span>{pic.personInCharge.name}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <Show when={d().room?.roomFacilities && d().room.roomFacilities.length > 0}>
              <div>
                <h3 class="text-sm font-medium text-muted-foreground mb-2">Facilities</h3>
                <div class="flex flex-wrap gap-2">
                  <For each={d().room?.roomFacilities}>
                    {(facility) => (
                      <div class="flex items-center gap-1 text-sm bg-background px-2 py-1 rounded border">
                        <Wrench class="size-4 text-muted-foreground" />
                        <span>{facility.facility.name}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <Separator />

            <div>
              <h3 class="text-lg font-semibold mb-4">Reservations</h3>
              <DataTable
                showSearchBar
                searchBy="agenda"
                searchPlaceholder="Search by agenda"
                columns={reservationColumns}
                data={d().reservations ?? []}
              />
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
