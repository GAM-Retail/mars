import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import FacilityForm, { FacilitySchema } from '~/components/FacilityForm';
import { editFacility, getFacilityById } from '~/server/controller/facility.server';
import { Show } from 'solid-js';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';

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
  },
} satisfies RouteDefinition;
export default function EditFacility() {
  const params = useParams<{ id: string }>();
  const facility = createAsync(() => getFacilityById(params.id));

  const navigate = useNavigate();
  const editFacilityAction = useAction(editFacility);
  const onSubmit: SubmitHandler<typeof FacilitySchema> = async (data) => {
    const response = await editFacilityAction({ ...data, id: params.id });
    if (response.status === 'success') {
      toast('Facility has been edited', {
        description: `${response.data.facility.name} has been edited successfully.`,
      });
      navigate(`/facility/${response.data.facility.id}`);
    } else {
      toast('Failed to create facility', {
        description: response.message,
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
            name: facility()?.data?.facility?.name,
            description: facility()?.data?.facility?.description as string,
          }}
        />
      </div>
    </Show>
  );
}
