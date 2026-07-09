import type { DivisionModel } from '~/generated/prisma/models';
import { createSignal } from 'solid-js';
import { A, revalidate, useAction, useNavigate } from '@solidjs/router';
import { deleteDivision, getAllDivision } from '~/server/controller/division.server';
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

export default function DetailDivisionDropdown(props: Readonly<{ division: DivisionModel }>) {
  const [open, setOpen] = createSignal(false);
  const deleteDivisionAction = useAction(deleteDivision);

  const navigate = useNavigate();
  const onDelete = async () => {
    try {
      await deleteDivisionAction(props.division.id);
      toast('Division has been deleted', {
        description: `Division ${props.division.name} has been deleted successfully.`,
      });
      navigate('/division');
      void revalidate(getAllDivision.key);
    } catch (error) {
      toast('Failed to delete division', {
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
          <DropdownMenuItem
            as={A}
            href={`/division/${props.division.id}/edit`}
            onSelect={() => navigate(`/division/${props.division.id}/edit`)}
          >
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
          <AlertDialogTitle>Delete {props.division.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this division? This action cannot be undone.</p>
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
