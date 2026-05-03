import { createAsync, type RouteDefinition } from '@solidjs/router';
import { Show, createSignal, createEffect } from 'solid-js';
import { UserRole } from '~/types';
import { getAllReservationsForCalendar } from '~/server/controller/reservation.server';
import { getRoomsByPersonInCharge } from '~/server/controller/room.server';
import { ReservationCalendar } from '~/components/kibo-ui/reservation-calendar';
import RoomsFilter from '~/routes/(protected)/reservation/components/RoomsFilter';

export const route = {
  info: {
    title: 'Dashboard',
    description: 'Reservation calendar overview',
    breadcrumb: { href: '/dashboard', label: 'Dashboard' },
    newButtonState: { label: 'New Reservation', href: '/reservation/new' },
    role: [UserRole.ADMIN],
  },
} satisfies RouteDefinition;

export default function DashboardPage() {
  const rooms = createAsync(() => getRoomsByPersonInCharge());
  const [selectedRooms, setSelectedRooms] = createSignal<string[]>([]);

  createEffect(() => {
    const data = rooms();
    if (data) {
      setSelectedRooms(data.map((room) => room.id));
    }
  });

  const allReservations = createAsync(() => getAllReservationsForCalendar());

  const filteredReservations = () => {
    const reservations = allReservations();
    if (!reservations) return [];
    if (selectedRooms().length === 0) return [];
    return reservations.filter((res) => selectedRooms().includes(res.roomId));
  };

  return (
    <div class="h-full max-h-[80vh] w-full p-2">
      <div class="mb-2 flex items-center gap-2">
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
      <Show when={filteredReservations()} fallback={<div class="p-4">Loading...</div>}>
        {(data) => <ReservationCalendar reservations={data()} class="h-full w-full" />}
      </Show>
    </div>
  );
}
