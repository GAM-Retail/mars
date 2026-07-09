import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import DepartmentForm, {
  DepartmentSchema,
} from '~/routes/(protected)/department/components/DepartmentForm';
import { editDepartment, getDepartmentById } from '~/server/controller/department.server';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { UserRole } from '~/types';
import { Show } from 'solid-js';

export const route = {
  info: {
    title: 'Edit Department',
    description: 'Edit Department',
    breadcrumb: {
      href: '#',
      label: 'Edit Department',
    },
    newButtonState: {
      label: 'New Department',
      href: '/department/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function EditDepartment() {
  const params = useParams<{ id: string }>();
  const department = createAsync(() => getDepartmentById(params.id));

  const navigate = useNavigate();
  const editDepartmentAction = useAction(editDepartment);
  const onSubmit: SubmitHandler<typeof DepartmentSchema> = async (data) => {
    try {
      const result = await editDepartmentAction({ ...data, id: params.id });
      toast('Department has been edited', {
        description: `${result.department.name} has been edited successfully.`,
      });
      navigate(`/department/${result.department.id}`);
    } catch (error) {
      toast('Failed to edit department', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <Show when={department()}>
      <div class="max-w-md sm:min-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href={`/department/${params.id}`} class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <h2 class="text-xl font-semibold">Edit department</h2>
        </span>
        <DepartmentForm
          onSubmit={onSubmit}
          initialValues={{
            name: department()?.department.name,
          }}
        />
      </div>
    </Show>
  );
}
