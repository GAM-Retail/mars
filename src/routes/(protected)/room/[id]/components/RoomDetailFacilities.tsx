import { toast } from 'solid-sonner';
import { useAction } from '@solidjs/router';
import {
  addFacilityToRoomAction,
  removeFacilityFromRoomAction,
} from '~/server/controller/room.server';
import SearchableSheet from '~/routes/(protected)/room/[id]/components/SearchableSheet';
import type { RoomGetPayload } from '~/generated/prisma/models/Room';

type RoomWithFacilities = RoomGetPayload<{
  include: {
    roomFacilities: { include: { facility: true } };
  };
}>;

type Props = {
  roomId: string;
  room: RoomWithFacilities;
  allFacilities: { id: string; name: string }[];
};

export default function RoomDetailFacilities(props: Readonly<Props>) {
  const addFacilityAction = useAction(addFacilityToRoomAction);
  const removeFacilityAction = useAction(removeFacilityFromRoomAction);

  const selectedFacilities = () =>
    props.room.roomFacilities.map((rf) => ({
      id: rf.facilityId,
      name: rf.facility.name,
    }));

  const handleAdd = async (facilityId: string) => {
    const response = await addFacilityAction(props.roomId, facilityId);
    if (response.status === 'success') {
      toast('Facility added');
    } else {
      toast('Failed to add facility', {
        description: response.message,
      });
    }
  };

  const handleRemove = async (facilityId: string) => {
    const response = await removeFacilityAction(props.roomId, facilityId);
    if (response.status === 'success') {
      toast('Facility removed');
    } else {
      toast('Failed to remove facility', {
        description: response.message,
      });
    }
  };

  return (
    <div>
      <p class="text-xs text-muted-foreground mb-2">Facilities</p>
      <SearchableSheet
        title="Add Facilities"
        description="Search and select facilities to add to this room."
        searchPlaceholder="Search facilities..."
        availableItems={props.allFacilities}
        selectedItems={selectedFacilities()}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  );
}
