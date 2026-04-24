import { createAsync, RouteDefinition, useNavigate, A } from '@solidjs/router';
import { Calendar, Cog, Shield } from 'lucide-solid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { getUser } from '~/server/controller/session.server';
import { UserRole } from '~/types';
import { Show, createSignal } from 'solid-js';
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">NIK</p>
              <p class="text-sm font-medium">{userResource()?.nik}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Email</p>
              <p class="text-sm">{userResource()?.email}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">Created At</p>
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
            <div>
              <p class="text-xs text-muted-foreground mb-1">Updated At</p>
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
      <ChangePasswordDialog
        userId={userResource()?.id ?? ''}
        open={passwordOpen()}
        onOpenChange={setPasswordOpen}
      />
    </Show>
  );
}
