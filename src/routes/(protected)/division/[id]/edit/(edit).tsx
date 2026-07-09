import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import DivisionForm, {
  DivisionSchema,
} from '~/routes/(protected)/division/components/DivisionForm';
import { editDivision, getDivisionById } from '~/server/controller/division.server';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { UserRole } from '~/types';
import { Show } from 'solid-js';

export const route = {
  info: {
    title: 'Edit Division',
    description: 'Edit Division',
    breadcrumb: {
      href: '#',
      label: 'Edit Division',
    },
    newButtonState: {
      label: 'New Division',
      href: '/division/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function EditDivision() {
  const params = useParams<{ id: string }>();
  const division = createAsync(() => getDivisionById(params.id));

  const navigate = useNavigate();
  const editDivisionAction = useAction(editDivision);
  const onSubmit: SubmitHandler<typeof DivisionSchema> = async (data) => {
    try {
      const result = await editDivisionAction({ ...data, id: params.id });
      toast('Division has been edited', {
        description: `${result.division.name} has been edited successfully.`,
      });
      navigate(`/division/${result.division.id}`);
    } catch (error) {
      toast('Failed to edit division', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <Show when={division()}>
      <div class="max-w-md sm:min-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href={`/division/${params.id}`} class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <h2 class="text-xl font-semibold">Edit division</h2>
        </span>
        <DivisionForm
          onSubmit={onSubmit}
          initialValues={{
            name: division()?.division.name,
          }}
        />
      </div>
    </Show>
  );
}
