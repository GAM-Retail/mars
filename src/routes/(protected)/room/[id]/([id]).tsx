import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { Show } from 'solid-js';
import Loading from '~/components/Loading';
import RoomDetail from '~/routes/(protected)/room/[id]/components/RoomDetail';
import { getAllFacilitiesForRoom, getRoomById } from '~/server/controller/room.server';
import { getAllUsers } from '~/server/controller/user.server';
import NotFound from '~/components/NotFound';

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
  },
} satisfies RouteDefinition;

export default function DetailRoom() {
  const params = useParams<{ id: string }>();
  const roomResource = createAsync(() => getRoomById(params.id));
  const facilitiesResource = createAsync(() => getAllFacilitiesForRoom());
  const usersResource = createAsync(() => getAllUsers());

  return (
    <Show when={roomResource()} fallback={<Loading />}>
      <Show
        when={
          roomResource()?.data?.room &&
          facilitiesResource()?.data?.facilities &&
          usersResource()?.data
        }
        fallback={<NotFound label="Room" href="/room" />}
      >
        <RoomDetail
          room={roomResource()!.data.room!}
          allFacilities={facilitiesResource()!.data.facilities}
          allUsers={usersResource()!.data}
        />
      </Show>
    </Show>
  );
}
