import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
} from '@solidjs/router';
import { deleteFacility, getFacilityById } from '~/server/controller/facility.server';
import { createSignal, Show } from 'solid-js';
import { CalendarPlus, CircleUser, Cog } from 'lucide-solid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import NotFound from '~/components/NotFound';
import Loading from '~/components/Loading';
import { toast } from 'solid-sonner';
import { FacilityGetPayload } from '~/generated/prisma/models/Facility';
import { useStableResource } from '~/hooks/useStableResource';

type FacilityWithUser = FacilityGetPayload<{
  include: { createdByUser: true };
}>;

export const route = {
  info: {
    title: 'Facility',
    description: 'Detail facility',
    breadcrumb: {
      href: '#',
      label: 'Detail Facility',
    },
    newButtonState: {
      label: 'New Facility',
      href: '/facility/new',
    },
  },
} satisfies RouteDefinition;

export default function DetailFacility() {
  const params = useParams<{ id: string }>();
  const facilityResource = createAsync(() => getFacilityById(params.id));
  const facility = useStableResource(() => facilityResource()?.data?.facility);
  return (
    <Show when={facilityResource()} fallback={<Loading />}>
      <Show when={facility()} fallback={<NotFound label="Facility" href="/facility" />}>
        {(data) => (
          <div class="w-full flex justify-center">
            <div class="border px-2 w-fit mt-20 rounded-md  py-2 min-w-120 bg-secondary flex flex-col gap-2">
              <div class="px-2 flex justify-between">
                <div class="">
                  <p class="text-xs opacity-80">Detail Facility</p>
                  <h2 class="text-2xl font-semibold">{data().name}</h2>
                </div>
                <DetailFacilityDropdown facility={data()} />
              </div>
              <div class="border rounded-lg bg-background px-2 py-1 min-h-30">
                <h3 class="text-xs">Description</h3>
                <p>{data().description ?? '-'}</p>
              </div>
              <div class="flex flex-col sm:flex-row justify-between">
                <span class="flex gap-2 items-center">
                  <CircleUser class="h-4 w-4" />
                  {data().createdByUser.name}
                </span>
                <span class="flex gap-2 items-center">
                  <CalendarPlus class="h-4 w-4" />
                  {data().createdAt.toLocaleString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </Show>
    </Show>
  );
}

const DetailFacilityDropdown = (props: { facility: FacilityWithUser }) => {
  const [open, setOpen] = createSignal(false);
  const deleteFacilityAction = useAction(deleteFacility);

  const navigate = useNavigate();
  const onDelete = async () => {
    const response = await deleteFacilityAction(props.facility.id);

    if (response.status === 'success') {
      toast('Facility has been deleted', {
        description: `Facility ${props.facility.name} has been deleted successfully.`,
      });
      navigate('/facility');
    } else {
      toast('Failed to delete facility');
    }
  };
  return (
    <>
      <DropdownMenu placement="right">
        <DropdownMenuTrigger class="flex item-start">
          <Cog class="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem as={A} href={`/facility/${props.facility.id}/edit`}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            as={Button}
            variant="destructive"
            class="w-full justify-start hover:bg-destructive/90! hover:text-destructive-foreground!"
            size="sm"
            onSelect={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open()} onOpenChange={setOpen} modal>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {props.facility.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this facility? This action cannot be undone.</p>
              <span>
                <Button variant="destructive" class="w-full mt-2 text-white" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" class="w-full mt-2" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
