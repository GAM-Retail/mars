import { createSignal } from 'solid-js';
import {
  Calendar,
  Cog,
  Shield,
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  MapPin,
} from 'lucide-solid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { toast } from 'solid-sonner';
import { useAction, useNavigate, A } from '@solidjs/router';
import { deleteUserAction } from '~/server/controller/user.server';
import type { User } from '~/generated/prisma/client';

type Props = {
  user: Omit<User, 'password'>;
};

export default function UserDetail(props: Readonly<Props>) {
  const navigate = useNavigate();
  const deleteUser = useAction(deleteUserAction);
  const [open, setOpen] = createSignal(false);

  const onDelete = async () => {
    try {
      await deleteUser(props.user.id);
      toast('User has been deleted', {
        description: `User ${props.user.name} has been deleted successfully.`,
      });
      navigate('/user');
    } catch (error) {
      toast('Failed to delete user', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div class="mt-10 px-4 flex flex-col gap-6">
      <div class="flex justify-between items-stretch border-b pb-4">
        <div>
          <p class="text-sm text-muted-foreground">User</p>
          <h1 class="text-3xl font-semibold tracking-tight">{props.user.name}</h1>
        </div>
        <div class="flex flex-col items-end justify-between">
          <DropdownMenu placement="right">
            <DropdownMenuTrigger class="flex item-start" aria-label="Options">
              <Cog class="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                as={A}
                href={`/user/${props.user.id}/edit`}
                onSelect={() => navigate(`/user/${props.user.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                as={Button}
                variant="destructive"
                class="w-full justify-start hover:bg-destructive/90! hover:text-destructive-foreground!"
                size="sm"
                onSelect={() => setOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <Shield class="h-4 w-4" />
              <span class={props.user.role === 'SUPERADMIN' ? 'text-primary font-medium' : ''}>
                {props.user.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4" />
              <span>
                {props.user.createdAt.toLocaleString('id-ID', {
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
                <p class="text-sm font-medium">{props.user.email}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Phone class="h-4 w-4" />
                  <p class="text-xs">Extension</p>
                </div>
                <p class="text-sm font-medium">{props.user.ext || '-'}</p>
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
                <p class="text-sm font-medium">{props.user.division || '-'}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Building2 class="h-4 w-4" />
                  <p class="text-xs">Department</p>
                </div>
                <p class="text-sm font-medium">{props.user.department || '-'}</p>
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
                      props.user.role === 'SUPERADMIN'
                        ? 'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'
                        : 'inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                    }
                  >
                    {props.user.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
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
                <p class="text-sm font-medium">{props.user.nik}</p>
              </div>
              <div class="space-y-2">
                <p class="text-xs text-muted-foreground">Created</p>
                <p class="text-sm">
                  {props.user.createdAt.toLocaleString('id-ID', {
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
                  {props.user.updatedAt.toLocaleString('id-ID', {
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

      <AlertDialog open={open()} onOpenChange={setOpen} modal>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {props.user.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              <span>
                <Button variant="destructive" class="w-full mt-2 text-white" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" class="w-full mt-2" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
