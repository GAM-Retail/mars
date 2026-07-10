import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import { ChevronDown, ArrowLeft, CalendarIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { ReservationCalendar } from '~/components/kibo-ui/reservation-calendar';

import { getAllRooms } from '~/lib/services/room.server';
import { getPublicReservations } from '~/lib/services/reservation.server';

export async function loader() {
  const [result, reservations] = await Promise.all([getAllRooms(), getPublicReservations()]);

  return {
    rooms: result?.rooms ?? [],
    reservations,
  };
}

function RoomFilter(
  props: Readonly<{
    selectedRooms: string[];
    data: { id: string; name: string }[];
    setSelectedRooms: (value: string[] | ((prev: string[]) => string[])) => void;
  }>,
) {
  const toggleRoom = (prev: string[], roomId: string, checked: boolean) => {
    if (checked) {
      return prev.includes(roomId) ? prev : [...prev, roomId];
    }
    return prev.filter((id) => id !== roomId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          Filter by room <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          className="capitalize"
          checked={props.selectedRooms.length === props.data.length}
          onCheckedChange={(value) =>
            props.setSelectedRooms(value ? props.data.map((r) => r.id) : [])
          }
        >
          All rooms
        </DropdownMenuCheckboxItem>
        {props.data.map((room) => (
          <DropdownMenuCheckboxItem
            key={room.id}
            className="capitalize"
            checked={props.selectedRooms.includes(room.id)}
            onCheckedChange={(value) =>
              props.setSelectedRooms((prev) => toggleRoom(prev, room.id, value))
            }
          >
            {room.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PublicCalendarPage() {
  const { rooms, reservations } = useLoaderData<typeof loader>();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  useEffect(() => {
    if (rooms.length > 0 && selectedRooms.length === 0) {
      setSelectedRooms(rooms.map((room) => room.id));
    }
  }, [rooms, selectedRooms.length]);

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
        <div className="mb-2 flex items-center gap-2">
          {rooms.length > 0 && (
            <RoomFilter
              selectedRooms={selectedRooms}
              data={rooms}
              setSelectedRooms={setSelectedRooms}
            />
          )}
        </div>
        {filteredReservations.length > 0 ? (
          <ReservationCalendar
            reservations={filteredReservations}
            className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] w-full"
          />
        ) : (
          <div className="p-4">Loading...</div>
        )}
      </main>
    </div>
  );
}
