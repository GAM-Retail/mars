import { A, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import { toast } from 'solid-sonner';
import { createUserAction } from '~/server/controller/user.server';
import UserForm, { UserSchema } from '~/routes/(protected)/user/components/UserForm';
import { UserRole } from '~/types';
import * as v from 'valibot';

export const route = {
  info: {
    title: 'New User',
    description: 'Create new User',
    breadcrumb: {
      href: '/user/new',
      label: 'New User',
    },
    newButtonState: {
      label: 'New User',
      href: '/user/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function NewUser() {
  const navigate = useNavigate();
  const createUser = useAction(createUserAction);
  const onSubmit = async (data: v.InferInput<typeof UserSchema>) => {
    try {
      // Formisch's <Form> cannot accept FormStore<CreateSchema> | FormStore<UpdateSchema>
      // that's why, `password` is optional in the shared schema and validate manually when creating a users.
      // Ref: https://github.com/open-circle/formisch/issues/152
      if (!data['password']) throw new Error('Password is required');
      const result = await createUser({
        nik: data.nik,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        password: data.password,
        ext: data.ext,
        divisionId: data.division?.value,
        departmentId: data.department?.value,
      });
      toast('Home has been created', {
        description: `${result.user.name} has been created successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/user/${result.user.id}`),
        },
      });
      navigate('/user');
    } catch (error) {
      toast('Failed to create user', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <A href="/user" class="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft class=" h-4 w-4" />
          Back
        </A>
        <h2 class="text-xl font-semibold">Create new user</h2>
      </span>
      <UserForm onSubmit={onSubmit} formType="create" />
    </div>
  );
}
