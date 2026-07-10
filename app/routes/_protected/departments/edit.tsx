import { useEffect } from 'react';
import { Form, useActionData, useNavigation, useLoaderData, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { getDepartmentById, updateDepartment } from '~/lib/services/department.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ params }: { params: { id: string } }) {
  const data = await getDepartmentById(params.id);
  return { department: data.department };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = await request.formData();
  try {
    await getCurrentUser(request);
    const result = await updateDepartment({ name: formData.get('name') as string, id: params.id });
    return redirect(`/departments/${result.id}`);
  } catch (err) {
    return catchResult(err);
  }
}

export default function EditDepartment() {
  const { department } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const actionError =
    actionData && !(actionData instanceof Response)
      ? ((actionData as Record<string, unknown>).message as string)
      : undefined;

  useEffect(() => {
    if (actionError) {
      toast.error('Failed to update department', { description: actionError });
    }
  }, [actionError]);

  return (
    <div className="max-w-md sm:min-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to={`/departments/${department.id}`} className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Edit department</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={department.name}
            required
            placeholder="Department name"
          />
        </div>
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    </div>
  );
}
