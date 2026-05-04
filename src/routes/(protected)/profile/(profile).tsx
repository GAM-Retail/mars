import { createAsync, RouteDefinition, useNavigate, A } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import {
  Calendar,
  Cog,
  Shield,
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
} from 'lucide-solid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { getUser } from '~/server/controller/session.server';
import { UserRole } from '~/types';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';

export const route = {
  info: {
    title: 'Profile',
    description: 'User Profile',
    breadcrumb: {
      href: '/profile',
      label: 'Profile',
    },
    role: [UserRole.SUPERADMIN, UserRole.ADMIN],
  },
} satisfies RouteDefinition;

export default function Profile() {
  const navigate = useNavigate();
  const userResource = createAsync(() => getUser());
  const [passwordOpen, setPasswordOpen] = createSignal(false);

  return (
    <Show when={userResource()}>
      <div class="mt-10 px-4 flex flex-col gap-6">
        <div class="flex justify-between items-stretch border-b pb-4">
          <div>
            <p class="text-sm text-muted-foreground">Profile</p>
            <h1 class="text-3xl font-semibold tracking-tight">{userResource()?.name}</h1>
          </div>
          <div class="flex flex-col items-end justify-between">
            <DropdownMenu placement="right">
              <DropdownMenuTrigger class="flex item-start" aria-label="Options">
                <Cog class="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  as={A}
                  href="/profile/edit"
                  onSelect={() => navigate('/profile/edit')}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
                  Change Password
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Shield class="h-4 w-4" />
                <span
                  class={userResource()?.role === 'SUPERADMIN' ? 'text-primary font-medium' : ''}
                >
                  {userResource()?.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4" />
                <span>
                  {userResource()?.createdAt.toLocaleString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-6">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <UserIcon class="h-5 w-5 text-muted-foreground" />
                  Contact Information
                </h3>
              </div>
              <div class="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Mail class="h-4 w-4" />
                    <p class="text-xs">Email</p>
                  </div>
                  <p class="text-sm font-medium">{userResource()?.email}</p>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Phone class="h-4 w-4" />
                    <p class="text-xs">Extension</p>
                  </div>
                  <p class="text-sm font-medium">{userResource()?.ext || '-'}</p>
                </div>
              </div>
            </div>

            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Building2 class="h-5 w-5 text-muted-foreground" />
                  Organization
                </h3>
              </div>
              <div class="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <MapPin class="h-4 w-4" />
                    <p class="text-xs">Division</p>
                  </div>
                  <p class="text-sm font-medium">{userResource()?.division || '-'}</p>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Building2 class="h-4 w-4" />
                    <p class="text-xs">Department</p>
                  </div>
                  <p class="text-sm font-medium">{userResource()?.department || '-'}</p>
                </div>
              </div>
            </div>

            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Shield class="h-5 w-5 text-muted-foreground" />
                  Role & Access
                </h3>
              </div>
              <div class="p-6 pt-0">
                <div class="space-y-2">
                  <p class="text-xs text-muted-foreground">Role</p>
                  <p class="text-sm">
                    <span
                      class={
                        userResource()?.role === 'SUPERADMIN'
                          ? 'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'
                          : 'inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                      }
                    >
                      {userResource()?.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                  <Calendar class="h-5 w-5 text-muted-foreground" />
                  System Info
                </h3>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <div class="space-y-2">
                  <p class="text-xs text-muted-foreground">NIK</p>
                  <p class="text-sm font-medium">{userResource()?.nik}</p>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Clock class="h-4 w-4" />
                    <p class="text-xs">Created</p>
                  </div>
                  <p class="text-sm">
                    {userResource()?.createdAt.toLocaleString('id-ID', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div class="space-y-2">
                  <p class="text-xs text-muted-foreground">Last Updated</p>
                  <p class="text-sm">
                    {userResource()?.updatedAt.toLocaleString('id-ID', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordDialog
        userId={userResource()?.id ?? ''}
        open={passwordOpen()}
        onOpenChange={setPasswordOpen}
      />
    </Show>
  );
}
