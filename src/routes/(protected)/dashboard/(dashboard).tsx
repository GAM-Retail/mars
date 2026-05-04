import { type RouteDefinition } from '@solidjs/router';
import { Show } from 'solid-js';
import { UserRole } from '~/types';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import CalendarDashboard from '~/routes/(protected)/dashboard/components/CalendarDashboard';
import SuperadminDashboard from '~/routes/(protected)/dashboard/components/SuperadminDashboard';

export const route = {
  info: {
    title: 'Dashboard',
    description: 'Reservation calendar overview',
    breadcrumb: { href: '/dashboard', label: 'Dashboard' },
    newButtonState: { label: 'New Reservation', href: '/reservation/new', role: [UserRole.ADMIN] },
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function DashboardPage() {
  const userContext = useCurrentUser();
  const userRole = userContext.currentUser?.role;

  return (
    <div class="h-full max-h-[80vh] w-full p-2">
      <Show when={userRole === UserRole.SUPERADMIN} fallback={<CalendarDashboard />}>
        <SuperadminDashboard />
      </Show>
    </div>
  );
}
