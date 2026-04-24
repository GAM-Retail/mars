import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import FacilityForm, {
  FacilitySchema,
} from '~/routes/(protected)/facility/components/FacilityForm';
import { editFacility, getFacilityById } from '~/server/controller/facility.server';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { UserRole } from '~/types';
import { Show } from 'solid-js';

export const route = {
  info: {
    title: 'Edit Facility',
    description: 'Edit Facility',
    breadcrumb: {
      href: '#',
      label: 'Edit Facility',
    },
    newButtonState: {
      label: 'New Facility',
      href: '/facility/new',
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;
export default function EditFacility() {
  const params = useParams<{ id: string }>();
  const facility = createAsync(() => getFacilityById(params.id));

  const navigate = useNavigate();
  const editFacilityAction = useAction(editFacility);
  const onSubmit: SubmitHandler<typeof FacilitySchema> = async (data) => {
    try {
      const result = await editFacilityAction({ ...data, id: params.id });
      toast('Facility has been edited', {
        description: `${result.facility.name} has been edited successfully.`,
      });
      navigate(`/facility/${result.facility.id}`);
    } catch (error) {
      toast('Failed to edit facility', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <Show when={facility()}>
      <div class="max-w-md sm:min-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href={`/facility/${params.id}`} class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <h2 class="text-xl font-semibold">Edit facility</h2>
        </span>
        <FacilityForm
          onSubmit={onSubmit}
          initialValues={{
            name: facility()?.facility.name,
            description: facility()?.facility.description as string,
          }}
        />
      </div>
    </Show>
  );
}
