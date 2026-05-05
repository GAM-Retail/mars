import { createAsync } from '@solidjs/router';
import { getRoomsByPersonInCharge } from '~/server/controller/room.server';
import { createEffect, createSignal, Show } from 'solid-js';
import { getAllReservationsForCalendar } from '~/server/controller/reservation.server';
import RoomsFilter from '~/routes/(protected)/reservation/components/RoomsFilter';
import { ReservationCalendar } from '~/components/kibo-ui/reservation-calendar';
import Loading from '~/components/Loading';

export default function CalendarDashboard() {
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
    <div>
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
      <Show when={filteredReservations()} fallback={<Loading />}>
        {(data) => <ReservationCalendar reservations={data()} class=" min-h-[80vh] w-full" />}
      </Show>
    </div>
  );
}
