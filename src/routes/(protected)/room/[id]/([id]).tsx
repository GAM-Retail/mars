import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { Show, Suspense } from 'solid-js';
import Loading from '~/components/Loading';
import RoomDetail from '~/routes/(protected)/room/[id]/components/RoomDetail';
import { getAllFacilitiesForRoom, getRoomById } from '~/server/controller/room.server';
import { getAllUsers } from '~/server/controller/user.server';
import { UserRole } from '~/types';

export const route = {
  info: {
    title: 'Room',
    description: 'Detail Room',
    breadcrumb: {
      href: '#',
      label: 'Detail Room',
    },
    newButtonState: {
      label: 'New Room',
      href: '/room/new',
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function DetailRoom() {
  const params = useParams<{ id: string }>();

  const data = createAsync(async () => {
    const [room, facilities, users] = await Promise.all([
      getRoomById(params.id),
      getAllFacilitiesForRoom(),
      getAllUsers(),
    ]);

    return {
      room: room.room,
      facilities: facilities.facilities,
      users,
    };
  });

  return (
    <Suspense fallback={<Loading />}>
      <Show when={data()}>
        {(d) => <RoomDetail room={d().room} allFacilities={d().facilities} allUsers={d().users} />}
      </Show>
    </Suspense>
  );
}
