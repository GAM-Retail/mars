import { useState } from 'react';
import { useLoaderData, Link } from 'react-router';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { ReservationCalendar } from '~/components/kibo-ui/reservation-calendar';

import { getAllRooms } from '~/lib/services/room.server';
import { getPublicReservations } from '~/lib/services/reservation.server';
import RoomsFilter from '~/components/RoomsFilter';

export async function loader() {
  const [result, reservations] = await Promise.all([getAllRooms(), getPublicReservations()]);

  return {
    rooms: result?.rooms ?? [],
    reservations,
  };
}

export default function PublicCalendarPage() {
  const { rooms, reservations } = useLoaderData<typeof loader>();
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    rooms.length > 0 ? rooms.map((r) => r.id) : [],
  );

  const filteredReservations =
    selectedRooms.length > 0
      ? reservations.filter((res) => selectedRooms.includes(res.roomId))
      : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Login</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-5 text-primary" />
              <h1 className="text-xl font-semibold">Meeting Room Calendar</h1>
            </div>
          </div>
          <div className="text-sm text-muted-foreground hidden md:block">Public View</div>
        </div>
      </header>

      <main className="flex-1 p-2 md:p-4 max-w-7xl mx-auto w-full">
        {rooms.length > 0 && (
          <RoomsFilter
            selectedRooms={selectedRooms}
            data={rooms}
            setSelectedRooms={setSelectedRooms}
          />
        )}
        <ReservationCalendar
          reservations={filteredReservations}
          className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] w-full"
        />
      </main>
    </div>
  );
}
