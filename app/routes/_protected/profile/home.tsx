import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Building2, Shield, User as UserIcon, Cog, CalendarPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Form, useActionData, useNavigation, useLoaderData, Link, useFetcher } from 'react-router';
import { toast } from 'sonner';

import { getCurrentUser } from '~/lib/current-user.server';
import { getUserById, changeUserPassword } from '~/lib/services/user.server';
import { verifyPassword } from '~/lib/hash.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  return { user };
}

export async function action({
  request,
}: {
  request: Request;
}): Promise<{ success: true } | { success: false; message: string }> {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'change-password') {
    try {
      const user = await getCurrentUser(request);
      const fullUser = await getUserById(user.id, { includeSensitive: true });
      if (!fullUser) throw new Error('User not found');
      const isValid = await verifyPassword(
        formData.get('currentPassword') as string,
        (fullUser as unknown as { password: string }).password,
      );
      if (!isValid) throw new Error('Current password is incorrect');
      await changeUserPassword(user.id, formData.get('newPassword') as string);
      return { success: true };
    } catch (err) {
      return catchResult(err);
    }
  }

  return { success: false, message: 'Unknown intent' };
}

export default function Home() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const [passwordOpen, setPasswordOpen] = useState(false);

  const actionError = useMemo(() => {
    if (actionData && 'success' in actionData && !actionData.success && actionData.message) {
      return actionData.message;
    }
    return undefined;
  }, [actionData]);

  const actionSuccess = useMemo(() => {
    return !!(actionData && 'success' in actionData && actionData.success);
  }, [actionData]);

  useEffect(() => {
    if (actionError) {
      toast.error('Failed to change password', { description: actionError });
    }
    if (actionSuccess) {
      toast.success('Password changed successfully. You will be logged out shortly.');
    }
  }, [actionSuccess, actionError]);

  if (actionSuccess) {
    setTimeout(() => fetcher.submit(null, { action: '/logout', method: 'post' }), 3000);
    return (
      <div className="mt-10 px-4 text-center">
        <h2 className="text-xl font-semibold">Password Changed</h2>
        <p className="text-muted-foreground mt-2">
          Your password has been changed. You will be redirected to login...
        </p>
        <Button
          className="mt-4"
          onClick={() => fetcher.submit(null, { action: '/logout', method: 'post' })}
        >
          Go to Login
        </Button>
      </div>
    );
  }

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
                Joined{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Options">
              <Cog className="size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to="/profile/edit">Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
              Change Password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <p className="text-sm font-medium">{user.divisionId || '-'}</p>
                <p className="text-xs text-muted-foreground">Division</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.departmentId || '-'}</p>
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

      <AlertDialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Change Password</AlertDialogTitle>
          <AlertDialogDescription>
            <Form method="post" className="flex flex-col gap-4 mt-4">
              <input type="hidden" name="intent" value="change-password" />
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
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
              {actionError && <p className="text-sm text-destructive">{actionError}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
