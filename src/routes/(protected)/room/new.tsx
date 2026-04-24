import { A, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { addRoom } from '~/server/controller/room.server';
import RoomForm, { RoomSchema } from '~/routes/(protected)/room/components/RoomForm';
import { UserRole } from '~/types';
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
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function NewRoom() {
  const navigate = useNavigate();
  const addRoomAction = useAction(addRoom);
  const onSubmit: SubmitHandler<typeof RoomSchema> = async (data) => {
    try {
      const result = await addRoomAction(data);
      toast('Room has been created', {
        description: `${result.room.name} has been created successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/room/${result.room.id}`),
        },
      });
      navigate('/room');
    } catch (error) {
      toast('Failed to create room', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
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
