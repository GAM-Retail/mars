import { useState } from 'react';
import { Form, useNavigation, Link, useLoaderData } from 'react-router';
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
import { ArrowLeft } from 'lucide-react';

import { getOrganizationData } from '~/lib/services/division.server';
import OrganizationCombobox from '~/components/OrganizationCombobox';

export async function loader() {
  return getOrganizationData();
}

import { createUser } from '~/lib/services/user.server';
import { requireSuperAdmin } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';
import { redirectWithToast } from '~/lib/utils.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  try {
    await requireSuperAdmin(request);
    const result = await createUser({
      nik: formData.get('nik') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'ADMIN' | 'SUPERADMIN',
      password: formData.get('password') as string,
      ext: (formData.get('ext') as string) || undefined,
      divisionId: (formData.get('divisionId') as string) || undefined,
      departmentId: (formData.get('departmentId') as string) || undefined,
    });
    return redirectWithToast(request, `/users/${result.id}`, {
      type: 'success',
      title: 'User created',
      description: 'User has been created successfully.',
    });
  } catch (err) {
    return catchResult(request, err);
  }
}

export default function NewUser() {
  const { divisions, departmentsByDivision } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  return (
    <div className="max-w-md sm:max-w-lg border rounded-md mx-auto my-4 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to="/users" className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Create new user</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nik">NIK</Label>
          <Input id="nik" name="nik" required maxLength={6} placeholder="6-digit NIK" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Full name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="Email address" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select name="role" required defaultValue="">
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Min 6 characters"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ext">Extension</Label>
          <Input id="ext" name="ext" placeholder="Optional extension number" />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    </div>
  );
}
