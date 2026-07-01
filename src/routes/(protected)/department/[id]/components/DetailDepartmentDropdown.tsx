import type { DepartmentModel } from '~/generated/prisma/models';
import { createSignal } from 'solid-js';
import { A, revalidate, useAction, useNavigate } from '@solidjs/router';
import { deleteDepartment, getAllDepartment } from '~/server/controller/department.server';
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

export default function DetailDepartmentDropdown(props: Readonly<{ department: DepartmentModel }>) {
  const [open, setOpen] = createSignal(false);
  const deleteDepartmentAction = useAction(deleteDepartment);

  const navigate = useNavigate();
  const onDelete = async () => {
    try {
      await deleteDepartmentAction(props.department.id);
      toast('Department has been deleted', {
        description: `Department ${props.department.name} has been deleted successfully.`,
      });
      navigate('/department');
      void revalidate(getAllDepartment.key);
    } catch (error) {
      toast('Failed to delete department', {
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
            href={`/department/${props.department.id}/edit`}
            onSelect={() => navigate(`/department/${props.department.id}/edit`)}
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
          <AlertDialogTitle>Delete {props.department.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this department? This action cannot be undone.</p>
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
