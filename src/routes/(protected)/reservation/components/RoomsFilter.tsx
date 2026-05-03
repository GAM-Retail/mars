import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { ChevronDown } from 'lucide-solid';
import { For } from 'solid-js';
import { Room } from '~/generated/prisma/client';

type RoomsFilterProps = {
  selectedRooms: string[];
  data: Room[];
  setSelectedRooms: (value: string[] | ((prev: string[]) => string[])) => void;
};
export default function RoomsFilter(props: Readonly<RoomsFilterProps>) {
  const toggleRoom = (prev: string[], roomId: string, checked: boolean) => {
    if (checked) {
      return prev.includes(roomId) ? prev : [...prev, roomId];
    }

    return prev.filter((id) => id !== roomId);
  };
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger as={Button<'button'>} size="sm" variant="outline" class="ml-auto">
        Show rooms <ChevronDown />
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
