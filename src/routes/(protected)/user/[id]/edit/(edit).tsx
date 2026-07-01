import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { ArrowLeft, RotateCcw } from 'lucide-solid';
import { toast } from 'solid-sonner';
import { getUserByIdController, updateUserAction } from '~/server/controller/user.server';
import UserForm, { UserSchema } from '~/routes/(protected)/user/components/UserForm';
import { UserRole } from '~/types';
import * as v from 'valibot';
import { Show, createSignal } from 'solid-js';
import { ResetPasswordDialog } from '../components/ResetPasswordDialog';
import { Button } from '~/components/ui/button';

export const route = {
  info: {
    title: 'Edit User',
    description: 'Edit User',
    breadcrumb: {
      href: '/user/edit',
      label: 'Edit User',
    },
    newButtonState: {
      label: 'New User',
      href: '/user/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function EditUser() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userResource = createAsync(() => getUserByIdController(params.id));
  const updateUser = useAction(updateUserAction);
  const [passwordOpen, setPasswordOpen] = createSignal(false);

  const onSubmit = async (data: v.InferInput<typeof UserSchema>) => {
    try {
      const result = await updateUser({
        id: params.id,
        nik: data.nik,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        password: data.password || undefined,
        ext: data.ext || undefined,
        division: data.division || undefined,
        department: data.department || undefined,
      });
      toast('User has been updated', {
        description: `${result.user.name} has been updated successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/user/${result.user.id}`),
        },
      });
      navigate(`/user/${params.id}`);
    } catch (error) {
      toast('Failed to update user', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <Show when={userResource()}>
      <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href={`/user/${params.id}`} class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Edit user</h2>
            <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
              <RotateCcw class="h-4 w-4 mr-2" />
              Reset Password
            </Button>
          </div>
        </span>
        <UserForm
          onSubmit={onSubmit}
          showPassword={false}
          initialValues={{
            nik: userResource()?.user.nik,
            name: userResource()?.user.name,
            email: userResource()?.user.email,
            role: userResource()?.user.role,
            ext: userResource()?.user.ext || undefined,
            division: userResource()?.user.division?.name || undefined,
            department: userResource()?.user.department?.name || undefined,
          }}
        />
      </div>
      <ResetPasswordDialog
        userId={params.id}
        userName={userResource()?.user.name ?? ''}
        open={passwordOpen()}
        onOpenChange={setPasswordOpen}
      />
    </Show>
  );
}
