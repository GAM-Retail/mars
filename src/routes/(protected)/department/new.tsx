import { A, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import DepartmentForm, {
  DepartmentSchema,
} from '~/routes/(protected)/department/components/DepartmentForm';
import { ArrowLeft } from 'lucide-solid';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { addDepartment } from '~/server/controller/department.server';
import { UserRole } from '~/types';

export const route = {
  info: {
    title: 'New Department',
    description: 'Create new department',
    breadcrumb: {
      href: '/department/new',
      label: 'New Department',
    },
    newButtonState: {
      label: 'New Department',
      href: '/department/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function NewDepartment() {
  const navigate = useNavigate();
  const addDepartmentAction = useAction(addDepartment);
  const onSubmit: SubmitHandler<typeof DepartmentSchema> = async (data) => {
    try {
      const result = await addDepartmentAction(data);
      toast('Department has been created', {
        description: `${result.department.name} has been created successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/department/${result.department.id}`),
        },
      });
      navigate('/department');
    } catch (error) {
      toast('Failed to create department', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <A href="/department" class="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft class=" h-4 w-4" />
          Back
        </A>
        <h2 class="text-xl font-semibold">Create new department</h2>
      </span>
      <DepartmentForm onSubmit={onSubmit} />
    </div>
  );
}
