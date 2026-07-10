import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { Room } from '~/generated/prisma/client';

type RoomsFilterProps = {
  selectedRooms: string[];
  data: Room[];
  setSelectedRooms: (value: string[] | ((prev: string[]) => string[])) => void;
};

function toggleRoom(prev: string[], roomId: string, checked: boolean) {
  if (checked) {
    return prev.includes(roomId) ? prev : [...prev, roomId];
  }
  return prev.filter((id) => id !== roomId);
}

export default function RoomsFilter(props: Readonly<RoomsFilterProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="ml-auto">
          Show rooms <ChevronDown />
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
