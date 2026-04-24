import { logout } from '~/server/controller/session.server';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { RouteDefinition } from '@solidjs/router';
import { UserRole } from '~/types';

export const route = {
  info: {
    title: 'Home',
    description: 'Home page',
    role: [UserRole.SUPERADMIN, UserRole.ADMIN],
    breadcrumb: {
      href: '/',
      label: 'Home',
    },
  },
} satisfies RouteDefinition;
export default function Home() {
  const userContext = useCurrentUser();
  return (
    <div class="w-full space-y-2">
      <h2 class="font-bold text-3xl text-primary">Hello {userContext?.currentUser?.name}</h2>
      <h3 class="font-bold text-xl">Message board</h3>
      <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
    </div>
  );
}
