import { useEffect, useState } from 'react';
import { useLoaderData, useFetcher, Link, useNavigate, replace } from 'react-router';
import { CalendarPlus, Cog, Mail, Phone, Building2, Shield, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Badge } from '~/components/ui/badge';
import { toast } from 'sonner';

import {
  getUserById,
  deleteUser,
  checkUserActiveReservations,
  resetPasswordAction,
} from '~/lib/services/user.server';
import { requireSuperAdmin } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import type { Route } from './+types/id';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireSuperAdmin(request);
  const user = await getUserById(params.id);
  if (!user) throw new Error('User does not exist');
  return { user };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  try {
    const actor = await requireSuperAdmin(request);
    const existingUser = await getUserById(params.id);
    if (!existingUser) return { success: false, message: 'User does not exist' };
    if (intent === 'reset-password') {
      await resetPasswordAction(request, {
        id: params.id,
        newPassword: formData.get('newPassword') as string,
      });
      return { success: true, intent: 'reset-password' };
    }
    const { hasReservations } = await checkUserActiveReservations(params.id);
    if (hasReservations)
      return {
        success: false,
        message: 'Cannot delete users with active reservations. Please remove reservations first.',
      };
    await deleteUser(params.id, actor.id);
    return replace('/users');
  } catch (err) {
    return catchResult(err);
  }
}

export default function UserDetails() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const isSubmitting = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.data?.success) {
      if (fetcher.data.intent === 'reset-password') {
        toast.success('Password has been reset');
        setPasswordOpen(false);
      } else {
        toast.success('User has been deleted');
      }
    }
    if (!fetcher.data?.success && fetcher.data?.message) {
      toast.error('Failed to delete', { description: fetcher.data?.message });
    }
  }, [fetcher.data, navigate]);

  return (
    <div className="mt-10 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-stretch border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="size-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">{user.name}</h1>
              <Badge variant={user.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                <Shield className="size-3 mr-1" />
                {user.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarPlus className="size-4" />
              <span>
                Created{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Options">
                <Cog className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to={`/users/${user.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            {user.ext && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{user.ext}</p>
                  <p className="text-xs text-muted-foreground">Extension</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.division?.name || '-'}</p>
                <p className="text-xs text-muted-foreground">Division</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.department?.name || '-'}</p>
                <p className="text-xs text-muted-foreground">Department</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Role & Access</h3>
          <div className="flex items-center gap-3">
            <Shield className="size-4 text-muted-foreground" />
            <div>
              <Badge variant={user.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">User Role</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">System Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.nik}</p>
                <p className="text-xs text-muted-foreground">NIK</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarPlus className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">Created</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarPlus className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">Last Updated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {user.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => {
                fetcher.submit(null, { method: 'post' });
              }}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              You are about to reset the password for <b>{user.name}</b>.
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="intent" value="reset-password" />
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                placeholder="Min 6 characters"
              />
            </div>
            {!fetcher.data?.success && fetcher.data?.message && (
              <p className="text-sm text-destructive">{fetcher.data?.message}</p>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                Cancel
              </Button>
            </div>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
