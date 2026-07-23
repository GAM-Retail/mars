import { Form, useNavigation, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ArrowLeft } from 'lucide-react';

import { getCurrentUser } from '~/lib/current-user.server';
import { createDepartment } from '~/lib/services/department.server';
import { catchResult } from '~/lib/error/response.server';
import { redirectWithToast } from '~/lib/utils.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  try {
    await getCurrentUser(request);
    await createDepartment({ name: formData.get('name') as string });
    return redirectWithToast(request, '/departments', {
      type: 'success',
      title: 'Department created',
      description: 'Department has been created successfully.',
    });
  } catch (err) {
    return catchResult(request, err);
  }
}

export default function NewDepartment() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';

  return (
    <div className="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to="/department" className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Create new department</h2>
      </span>
      <Form method="post" className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Department name" />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    </div>
  );
}
