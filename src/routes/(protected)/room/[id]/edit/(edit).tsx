import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import RoomForm, { RoomSchema } from '~/routes/(protected)/room/components/RoomForm';
import { editRoom, getRoomById } from '~/server/controller/room.server';
import { Show } from 'solid-js';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';

export const route = {
  info: {
    title: 'Edit Room',
    description: 'Edit Room',
    breadcrumb: {
      href: '#',
      label: 'Edit Room',
    },
    newButtonState: {
      label: 'New Room',
      href: '/room/new',
    },
  },
} satisfies RouteDefinition;
export default function EditRoom() {
  const params = useParams<{ id: string }>();
  const room = createAsync(() => getRoomById(params.id));

  const navigate = useNavigate();
  const editRoomAction = useAction(editRoom);
  const onSubmit: SubmitHandler<typeof RoomSchema> = async (data) => {
    const response = await editRoomAction({ ...data, id: params.id });
    if (response.status === 'success') {
      toast('Room has been edited', {
        description: `${response.data.room.name} has been edited successfully.`,
      });
      navigate(`/room/${response.data.room.id}`);
    } else {
      toast('Failed to edit room');
    }
  };
  return (
    <Show when={room()}>
      <div class="max-w-md sm:min-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href={`/room/${params.id}`} class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <h2 class="text-xl font-semibold">Edit room</h2>
        </span>
        <RoomForm
          onSubmit={onSubmit}
          initialValues={{
            name: room()?.data?.room?.name,
            location: room()?.data?.room?.location,
            capacity: room()?.data?.room?.capacity,
            description: room()?.data?.room?.description as string,
          }}
        />
      </div>
    </Show>
  );
}
