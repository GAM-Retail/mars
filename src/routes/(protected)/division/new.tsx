import { A, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import DivisionForm, {
  DivisionSchema,
} from '~/routes/(protected)/division/components/DivisionForm';
import { ArrowLeft } from 'lucide-solid';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { addDivision } from '~/server/controller/division.server';
import { UserRole } from '~/types';

export const route = {
  info: {
    title: 'New Division',
    description: 'Create new division',
    breadcrumb: {
      href: '/division/new',
      label: 'New Division',
    },
    newButtonState: {
      label: 'New Division',
      href: '/division/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function NewDivision() {
  const navigate = useNavigate();
  const addDivisionAction = useAction(addDivision);
  const onSubmit: SubmitHandler<typeof DivisionSchema> = async (data) => {
    try {
      const result = await addDivisionAction(data);
      toast('Division has been created', {
        description: `${result.division.name} has been created successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/division/${result.division.id}`),
        },
      });
      navigate('/division');
    } catch (error) {
      toast('Failed to create division', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <A href="/division" class="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft class=" h-4 w-4" />
          Back
        </A>
        <h2 class="text-xl font-semibold">Create new division</h2>
      </span>
      <DivisionForm onSubmit={onSubmit} />
    </div>
  );
}
