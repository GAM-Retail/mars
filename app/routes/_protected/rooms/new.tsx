import { Form, useNavigation, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

import { getCurrentUser } from '~/lib/current-user.server';
import { createRoom } from '~/lib/services/room.server';
import { catchResult } from '~/lib/error/response.server';
import { redirectWithToast } from '~/lib/utils.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  try {
    const user = await getCurrentUser(request);
    const result = await createRoom({
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      capacity: Number(formData.get('capacity')),
      description: (formData.get('description') as string) || undefined,
      createdBy: user.id,
    });
    return redirectWithToast(request, `/rooms/${result.id}`, {
      type: 'success',
      title: 'Room created',
      description: 'Room has been created successfully.',
    });
  } catch (err) {
    return catchResult(request, err);
  }
}

export default function NewRoom() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';

  return (
    <div className="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to="/rooms" className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Create new room</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Home name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required
            placeholder="Home capacity"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Textarea id="location" name="location" required placeholder="Home location" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Home description" />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    </div>
  );
}
