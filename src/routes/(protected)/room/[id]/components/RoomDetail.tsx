import { createSignal, Show } from 'solid-js';
import { CalendarPlus, CircleUser, Cog } from 'lucide-solid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { toast } from 'solid-sonner';
import { useAction, useNavigate, A } from '@solidjs/router';
import { deleteRoom } from '~/server/controller/room.server';
import type { RoomGetPayload } from '~/generated/prisma/models/Room';
import RoomDetailFacilities from './RoomDetailFacilities';
import RoomDetailPersonInCharge from './RoomDetailPersonInCharge';

export type RoomWithRelationships = RoomGetPayload<{
  include: {
    createdByUser: true;
    roomFacilities: { include: { facility: true } };
    roomPersonInCharges: { include: { personInCharge: true } };
  };
}>;

type Props = {
  room: RoomWithRelationships;
  allFacilities: { id: string; name: string }[];
  allUsers: { id: string; name: string }[];
};

export default function RoomDetail(props: Readonly<Props>) {
  const navigate = useNavigate();
  const deleteRoomAction = useAction(deleteRoom);
  const [open, setOpen] = createSignal(false);

  const onDelete = async () => {
    try {
      await deleteRoomAction(props.room.id);
      toast('Room has been deleted', {
        description: `Room ${props.room.name} has been deleted successfully.`,
      });
      navigate('/room');
    } catch (error) {
      toast('Failed to delete room', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div class="mt-10 px-4 flex flex-col gap-6">
      <div class="flex justify-between items-stretch border-b pb-4">
        <div>
          <p class="text-sm text-muted-foreground">Room</p>
          <h1 class="text-3xl font-semibold tracking-tight">{props.room.name}</h1>
        </div>
        <div class="flex flex-col items-end justify-between">
          <DropdownMenu placement="right">
            <DropdownMenuTrigger class="flex item-start" aria-label="Options">
              <Cog class="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                as={A}
                href={`/room/${props.room.id}/edit`}
                onSelect={() => navigate(`/room/${props.room.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                as={Button}
                variant="destructive"
                class="w-full justify-start hover:bg-destructive/90! hover:text-destructive-foreground!"
                size="sm"
                onSelect={() => setOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <CircleUser class="h-4 w-4" />
              <Show when={props?.room?.createdByUser?.name} fallback={<p>System</p>}>
                {(name) => <p>{name()}</p>}
              </Show>
            </div>
            <div class="flex items-center gap-2">
              <CalendarPlus class="h-4 w-4" />
              <span>
                {props.room.createdAt.toLocaleString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <p class="text-xs text-muted-foreground mb-1">Description</p>
            <p class="text-sm">{props.room.description || '-'}</p>
          </div>

          <div>
            <p class="text-xs text-muted-foreground mb-1">Location</p>
            <p class="text-sm">{props.room.location}</p>
          </div>

          <div>
            <p class="text-xs text-muted-foreground mb-1">Capacity</p>
            <p class="text-sm">{props.room.capacity} people</p>
          </div>
        </div>
        <div class="space-y-4">
          <RoomDetailFacilities
            roomId={props.room.id}
            room={props.room}
            allFacilities={props.allFacilities}
          />
          <RoomDetailPersonInCharge
            roomId={props.room.id}
            room={props.room}
            allUsers={props.allUsers}
          />
        </div>
      </div>

      <AlertDialog open={open()} onOpenChange={setOpen} modal>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {props.room.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this room? This action cannot be undone.</p>
              <span>
                <Button variant="destructive" class="w-full mt-2 text-white" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" class="w-full mt-2" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
