import { useState } from 'react';
import { useLoaderData } from 'react-router';
import RoomsFilter from '~/components/RoomsFilter';
import { ReservationCalendar } from '~/components/kibo-ui/reservation-calendar';

import { requireAdminOrSuperAdmin } from '~/lib/current-user.server';
import { getAllRoomsData, getRoomsByPersonInChargeQuery } from '~/lib/services/room.server';
import {
  getAllReservations,
  getReservationsByPersonInCharge,
} from '~/lib/services/reservation.server';

export async function loader({ request }: { request: Request }) {
  const user = await requireAdminOrSuperAdmin(request);
  const [rooms, reservations] = await Promise.all([
    user.role === 'SUPERADMIN' ? getAllRoomsData() : getRoomsByPersonInChargeQuery(user.id),
    user.role === 'SUPERADMIN' ? getAllReservations() : getReservationsByPersonInCharge(user),
  ]);

  return {
    rooms,
    reservations,
  };
}

export default function Dashboard() {
  const { rooms, reservations } = useLoaderData<typeof loader>();
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    rooms.length > 0 ? rooms.map((r) => r.id) : [],
  );

  const filteredReservations =
    selectedRooms.length > 0
      ? reservations.filter((res) => selectedRooms.includes(res.roomId))
      : [];

  return (
    <div className="h-full max-h-[80vh] w-full p-2">
      <div className="mb-2 flex items-center gap-2">
        {rooms.length > 0 && (
          <RoomsFilter
            selectedRooms={selectedRooms}
            data={rooms}
            setSelectedRooms={setSelectedRooms}
          />
        )}
      </div>
      <ReservationCalendar reservations={filteredReservations} className="min-h-[80vh] w-full" />
    </div>
  );
}
