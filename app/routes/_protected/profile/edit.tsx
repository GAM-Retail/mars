import { Form, useLoaderData, useActionData, useNavigation, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ArrowLeft } from 'lucide-react';

import { getCurrentUser } from '~/lib/current-user.server';
import { updateUser } from '~/lib/services/user.server';
import { catchResult } from '~/lib/error/response.server';
import db from '~/lib/db';

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  return { user };
}

export async function action({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const formData = await request.formData();
  try {
    const existingNik = await db.user.findUnique({
      where: { nik: formData.get('nik') as string, NOT: { id: user.id } },
    });
    if (existingNik) throw new Error('NIK already exists');
    const existingEmail = await db.user.findUnique({
      where: { email: formData.get('email') as string, NOT: { id: user.id } },
    });
    if (existingEmail) throw new Error('Email already exists');
    await updateUser({
      id: user.id,
      nik: formData.get('nik') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: user.role,
      ext: (formData.get('ext') as string) || undefined,
    });
    return redirect(`/profile`);
  } catch (err) {
    return catchResult(request, err);
  }
}

export default function EditProfile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const actionError =
    actionData && !actionData
      ? ((actionData as Record<string, unknown>).message as string)
      : undefined;

  return (
    <div className="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to="/profile" className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Edit Profile</h2>
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
          <Label htmlFor="ext">Extension</Label>
          <Input id="ext" name="ext" defaultValue={user.ext ?? ''} placeholder="Optional" />
        </div>
        <div className="grid gap-2">
          <Label>Division</Label>
          <p className="text-sm text-muted-foreground px-3 py-2 border rounded-md bg-muted/50">
            {user.divisionId || '-'}
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Department</Label>
          <p className="text-sm text-muted-foreground px-3 py-2 border rounded-md bg-muted/50">
            {user.departmentId || '-'}
          </p>
        </div>
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    </div>
  );
}
