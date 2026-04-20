import { A, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { addRoom } from '~/server/controller/room.server';
import RoomForm, { RoomSchema } from '~/routes/(protected)/room/components/RoomForm';
export const route = {
  info: {
    title: 'New Room',
    description: 'Create new Room',
    breadcrumb: {
      href: '/room/new',
      label: 'New Room',
    },
    newButtonState: {
      label: 'New Room',
      href: '/room/new',
    },
  },
} satisfies RouteDefinition;

export default function NewRoom() {
  const navigate = useNavigate();
  const addRoomAction = useAction(addRoom);
  const onSubmit: SubmitHandler<typeof RoomSchema> = async (data) => {
    const response = await addRoomAction(data);
    if (response.status === 'success') {
      toast('Room has been created', {
        description: `${response.data.room.name} has been created successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/room/${response.data.room.id}`),
        },
      });
      navigate('/room');
    } else {
      toast('Failed to create room');
    }
  };
  return (
    <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <A href="/room" class="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft class=" h-4 w-4" />
          Back
        </A>
        <h2 class="text-xl font-semibold">Create new room</h2>
      </span>
      <RoomForm onSubmit={onSubmit} />
    </div>
  );
}
