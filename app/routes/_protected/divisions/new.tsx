import { useEffect } from 'react';
import { Form, useActionData, useNavigation, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { getCurrentUser } from '~/lib/current-user.server';
import { createDivision } from '~/lib/services/division.server';
import { catchResult } from '~/lib/error/response.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  try {
    await getCurrentUser(request);
    await createDivision({ name: formData.get('name') as string });
    return redirect('/divisions');
  } catch (err) {
    return catchResult(err);
  }
}

export default function NewDivision() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const actionError = actionData && 'message' in actionData ? actionData.message : undefined;

  useEffect(() => {
    if (actionError) {
      toast.error('Failed to create division', { description: actionError });
    }
  }, [actionError]);

  return (
    <div className="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to="/divisions" className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Create new division</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Home name" required />
        </div>
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    </div>
  );
}
