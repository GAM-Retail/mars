import { useEffect, useState } from 'react';
import { Form, useLoaderData, useActionData, useNavigation, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

import { getUserById, updateUser, changeUserPassword } from '~/lib/services/user.server';
import { getOrganizationData } from '~/lib/services/division.server';
import { requireSuperAdmin } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';
import OrganizationCombobox from '~/components/OrganizationCombobox';

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  await requireSuperAdmin(request);
  const [userResult, orgData] = await Promise.all([getUserById(params.id), getOrganizationData()]);
  if (!userResult) throw new Error('User does not exist');
  return {
    user: userResult,
    ...orgData,
  };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    await requireSuperAdmin(request);
    if (intent === 'reset-password') {
      await changeUserPassword(params.id, formData.get('newPassword') as string);
      return { success: true };
    }
    const result = await updateUser({
      id: params.id,
      nik: formData.get('nik') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'ADMIN' | 'SUPERADMIN',
      ext: (formData.get('ext') as string) || undefined,
      divisionId: (formData.get('divisionId') as string) || undefined,
      departmentId: (formData.get('departmentId') as string) || undefined,
    });
    return redirect(`/users/${result.id}`);
  } catch (err) {
    return catchResult(err);
  }
}

export default function EditUser() {
  const { user, divisions, departmentsByDivision } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState(user.divisionId ?? '');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(user.departmentId ?? '');
  const actionError =
    actionData && !(actionData instanceof Response)
      ? ((actionData as Record<string, unknown>).message as string)
      : undefined;

  useEffect(() => {
    if (actionError) {
      toast.error('Failed to update users', { description: actionError });
    }
  }, [actionError]);

  return (
    <>
      <div className="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <Link to={`/users/${user.id}`} className="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit user</h2>
            <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Password
            </Button>
          </div>
        </span>
        <Form method="post" className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nik">NIK</Label>
            <Input id="nik" name="nik" required maxLength={6} defaultValue={user.nik} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required defaultValue={user.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required defaultValue={user.email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" required defaultValue={user.role}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ext">Extension</Label>
            <Input id="ext" name="ext" defaultValue={user.ext ?? ''} placeholder="Optional" />
          </div>
          <OrganizationCombobox
            divisions={divisions}
            departmentsByDivision={departmentsByDivision}
            divisionName="divisionId"
            departmentName="departmentId"
            divisionValue={selectedDivisionId}
            departmentValue={selectedDepartmentId}
            onDivisionChange={setSelectedDivisionId}
            onDepartmentChange={setSelectedDepartmentId}
          />
          {actionError && <p className="text-sm text-destructive">{actionError}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </div>

      <AlertDialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-sm text-muted-foreground mb-4">
              You are about to reset the password for{' '}
              <span className="font-medium">{user.name}</span>.
            </p>
            <Form method="post" className="flex flex-col gap-4">
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
              {actionError && <p className="text-sm text-destructive">{actionError}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
