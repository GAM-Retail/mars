import type { FacilityModel } from '~/generated/prisma/models';
import { createSignal } from 'solid-js';
import { A, useAction, useNavigate } from '@solidjs/router';
import { deleteFacility } from '~/server/controller/facility.server';
import { toast } from 'solid-sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Cog } from 'lucide-solid';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

type FacilityWithUser = FacilityModel;
export default function DetailFacilityDropdown(props: Readonly<{ facility: FacilityWithUser }>) {
  const [open, setOpen] = createSignal(false);
  const deleteFacilityAction = useAction(deleteFacility);

  const navigate = useNavigate();
const onDelete = async () => {
    try {
      await deleteFacilityAction(props.facility.id);
      toast('Facility has been deleted', {
        description: `Facility ${props.facility.name} has been deleted successfully.`,
      });
      navigate('/facility');
    } catch (error) {
      toast('Failed to delete facility', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <>
      <DropdownMenu placement="right">
        <DropdownMenuTrigger class="flex item-start" aria-label="Options">
          <Cog class="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem as={A} href={`/facility/${props.facility.id}/edit`} onSelect={() => navigate(`/facility/${props.facility.id}/edit`)}>
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
}
