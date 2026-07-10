import { useEffect } from 'react';
import { Form, useLoaderData, useActionData, useNavigation, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { getRoomById, updateRoom, getRoomByIdRaw } from '~/lib/services/room.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ params }: { params: { id: string } }) {
  const { room } = await getRoomById(params.id);
  return { room };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = await request.formData();
  try {
    const user = await getCurrentUser(request);
    const room = await getRoomByIdRaw(params.id);
    if (!room) return { success: false, message: 'Room not found' };
    if (room.createdBy !== user.id)
      return { success: false, message: 'You do not have permission' };
    const result = await updateRoom({
      id: params.id,
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      capacity: Number(formData.get('capacity')),
      description: (formData.get('description') as string) || undefined,
    });
    return redirect(`/rooms/${result.id}`);
  } catch (err) {
    return catchResult(err);
  }
}

export default function EditRoom() {
  const { room } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const actionError =
    actionData && !(actionData instanceof Response)
      ? ((actionData as Record<string, unknown>).message as string)
      : undefined;

  useEffect(() => {
    if (actionError) {
      toast.error('Failed to update rooms', { description: actionError });
    }
  }, [actionError]);

  return (
    <div className="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to={`/rooms/${room.id}`} className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Edit room</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={room.name} placeholder="Home name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required
            defaultValue={room.capacity}
            placeholder="Home capacity"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Textarea
            id="location"
            name="location"
            required
            defaultValue={room.location}
            placeholder="Home location"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={room.description ?? ''}
            placeholder="Home description"
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
