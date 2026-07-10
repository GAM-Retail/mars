import { useEffect } from 'react';
import { Form, useActionData, useNavigation, useLoaderData, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import {
  getFacilityById,
  updateFacility,
  getFacilityByIdRaw,
} from '~/lib/services/facility.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ params }: { params: { id: string } }) {
  const { facility } = await getFacilityById(params.id);
  return { facility };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = await request.formData();
  try {
    const user = await getCurrentUser(request);
    const facility = await getFacilityByIdRaw(params.id);
    if (!facility) return { success: false, message: 'Facility not found' };
    if (facility.createdBy !== user.id)
      return { success: false, message: 'You do not have permission' };
    const result = await updateFacility({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      id: params.id,
    });
    return redirect(`/facilities/${result.id}`);
  } catch (err) {
    return catchResult(err);
  }
}

export default function EditFacility() {
  const { facility } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const actionError =
    actionData && !(actionData instanceof Response)
      ? ((actionData as Record<string, unknown>).message as string)
      : undefined;

  useEffect(() => {
    if (actionError) {
      toast.error('Failed to update facilities', { description: actionError });
    }
  }, [actionError]);

  return (
    <div className="max-w-md sm:min-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to={`/facilities/${facility.id}`} className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Edit facility</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={facility.name}
            required
            placeholder="Facility name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            defaultValue={facility.description ?? ''}
            placeholder="Facility description"
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
