import { type RouteDefinition } from '@solidjs/router';
import { UserRole } from '~/types';
import CalendarDashboard from '~/routes/(protected)/dashboard/components/CalendarDashboard';

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
  return (
    <div class="h-full max-h-[80vh] w-full p-2">
      <CalendarDashboard />
    </div>
  );
}
