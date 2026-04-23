import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import UserDetail from '~/routes/(protected)/user/[id]/components/UserDetail';
import { getUserByIdController } from '~/server/controller/user.server';
import { UserRole } from '~/types';
import { Show } from 'solid-js';

export const route = {
  info: {
    title: 'User',
    description: 'Detail User',
    breadcrumb: {
      href: '#',
      label: 'Detail User',
    },
    newButtonState: {
      label: 'New User',
      href: '/user/new',
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function DetailUser() {
  const params = useParams<{ id: string }>();
  const user = createAsync(() => getUserByIdController(params.id));

  return <Show when={user()}>{(data) => <UserDetail user={data().user} />}</Show>;
}
