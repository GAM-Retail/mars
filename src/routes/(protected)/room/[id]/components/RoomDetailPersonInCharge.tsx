import { toast } from 'solid-sonner';
import { useAction } from '@solidjs/router';
import {
  addPersonInChargeAction,
  removePersonInChargeAction,
} from '~/server/controller/room.server';
import SearchableSheet from '~/routes/(protected)/room/[id]/components/SearchableSheet';
import type { RoomGetPayload } from '~/generated/prisma/models/Room';
import { X } from 'lucide-solid';

type RoomWithPersonInCharge = RoomGetPayload<{
  include: {
    roomPersonInCharges: { include: { personInCharge: true } };
  };
}>;

type Props = {
  roomId: string;
  room: RoomWithPersonInCharge;
  allUsers: { id: string; name: string }[];
};

export default function RoomDetailPersonInCharge(props: Readonly<Props>) {
  const addPersonInChargeActionFn = useAction(addPersonInChargeAction);
  const removePersonInChargeActionFn = useAction(removePersonInChargeAction);

  const selectedUsers = () =>
    props.room.roomPersonInCharges.map((rp) => ({
      id: rp.personInChargeId,
      name: rp.personInCharge.name,
    }));

const handleAdd = async (userId: string) => {
    try {
      await addPersonInChargeActionFn(props.roomId, userId);
      toast('Person in charge added');
    } catch (error) {
      toast('Failed to add person in charge', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removePersonInChargeActionFn(props.roomId, userId);
      toast('Person in charge removed');
    } catch (error) {
      toast('Failed to remove person in charge', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div>
      <p class="text-xs text-muted-foreground mb-2">Person In Charge</p>
      <SearchableSheet
        title="Add Person In Charge"
        description="Search and select a person to be in charge of this room."
        searchPlaceholder="Search users..."
        availableItems={props.allUsers}
        selectedItems={selectedUsers()}
        onAdd={handleAdd}
        onRemove={handleRemove}
        renderSelectedItem={(item, onRemove) => (
          <span class="flex items-center gap-2 text-sm">
            <span>{item.name}</span>
            <button class="text-muted-foreground hover:text-destructive" onClick={onRemove}>
              <X class="h-4 w-4" />
            </button>
          </span>
        )}
      />
    </div>
  );
}
