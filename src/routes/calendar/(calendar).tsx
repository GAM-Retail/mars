import { createAsync, type RouteDefinition } from '@solidjs/router';
import { Show, createSignal, createEffect, For } from 'solid-js';
import { getPublicReservations } from '~/server/controller/reservation.server';
import { getAllRooms } from '~/server/controller/room.server';
import { ReservationCalendar } from '~/components/kibo-ui/reservation-calendar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { ChevronDown, ArrowLeft, Calendar } from 'lucide-solid';
import { A } from '@solidjs/router';

export const route = {
  info: {
    title: 'Public Calendar',
    description: 'Meeting room reservation calendar',
  },
} satisfies RouteDefinition;

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
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger as={Button<'button'>} size="sm" variant="outline">
        Filter by room <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          class="capitalize"
          checked={props.selectedRooms.length === props.data.length}
          onChange={(value) => props.setSelectedRooms(value ? props.data.map((r) => r.id) : [])}
        >
          All rooms
        </DropdownMenuCheckboxItem>
        <For each={props.data}>
          {(room) => (
            <DropdownMenuCheckboxItem
              class="capitalize"
              checked={props.selectedRooms.includes(room.id)}
              onChange={(value) =>
                props.setSelectedRooms((prev) => toggleRoom(prev, room.id, value))
              }
            >
              {room.name}
            </DropdownMenuCheckboxItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PublicCalendarPage() {
  const allRooms = createAsync(async () => {
    const result = await getAllRooms();
    return result?.rooms ?? [];
  });
  const [selectedRooms, setSelectedRooms] = createSignal<string[]>([]);

  createEffect(() => {
    const data = allRooms();
    if (data) {
      setSelectedRooms(data.map((room) => room.id));
    }
  });

  const allReservations = createAsync(() => getPublicReservations());

  const filteredReservations = () => {
    const reservations = allReservations();
    if (!reservations) return [];
    if (selectedRooms().length === 0) return [];
    return reservations.filter((res) => selectedRooms().includes(res.roomId));
  };

  return (
    <div class="min-h-screen bg-background flex flex-col">
      <header class="border-b bg-card px-4 py-3">
        <div class="flex items-center justify-between max-w-7xl mx-auto">
          <div class="flex items-center gap-4">
            <A
              href="/login"
              class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft class="size-4" />
              <span class="hidden sm:inline">Back to Login</span>
            </A>
            <div class="h-6 w-px bg-border" />
            <div class="flex items-center gap-2">
              <Calendar class="size-5 text-primary" />
              <h1 class="text-xl font-semibold">Meeting Room Calendar</h1>
            </div>
          </div>
          <div class="text-sm text-muted-foreground hidden md:block">Public View</div>
        </div>
      </header>

      <main class="flex-1 p-2 md:p-4 max-w-7xl mx-auto w-full">
        <div class="mb-2 flex items-center gap-2">
          <Show when={allRooms()}>
            {(data) => (
              <RoomFilter
                selectedRooms={selectedRooms()}
                data={data()}
                setSelectedRooms={setSelectedRooms}
              />
            )}
          </Show>
        </div>
        <Show when={filteredReservations()} fallback={<div class="p-4">Loading...</div>}>
          {(data) => (
            <ReservationCalendar
              reservations={data()}
              class="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] w-full"
            />
          )}
        </Show>
      </main>
    </div>
  );
}
