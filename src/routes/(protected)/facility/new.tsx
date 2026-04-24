import { A, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import FacilityForm, {
  FacilitySchema,
} from '~/routes/(protected)/facility/components/FacilityForm';
import { ArrowLeft } from 'lucide-solid';
import { SubmitHandler } from '@formisch/solid';
import { toast } from 'solid-sonner';
import { addFacility } from '~/server/controller/facility.server';
import { UserRole } from '~/types';
export const route = {
  info: {
    title: 'New Facility',
    description: 'Create new facility',
    breadcrumb: {
      href: '/facility/new',
      label: 'New Facility',
    },
    newButtonState: {
      label: 'New Facility',
      href: '/facility/new',
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function NewFacility() {
  const navigate = useNavigate();
  const addFacilityAction = useAction(addFacility);
  const onSubmit: SubmitHandler<typeof FacilitySchema> = async (data) => {
    try {
      const result = await addFacilityAction(data);
      toast('Facility has been created', {
        description: `${result.facility.name} has been created successfully.`,
        action: {
          label: 'Detail',
          onClick: () => navigate(`/facility/${result.facility.id}`),
        },
      });
      navigate('/facility');
    } catch (error) {
      toast('Failed to create facility', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <A href="/facility" class="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft class=" h-4 w-4" />
          Back
        </A>
        <h2 class="text-xl font-semibold">Create new facility</h2>
      </span>
      <FacilityForm onSubmit={onSubmit} />
    </div>
  );
}
