import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Cog } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import type { DepartmentModel } from '~/generated/prisma/models';

export default function DetailDepartmentDropdown({
  department,
  onDelete,
}: Readonly<{
  department: DepartmentModel;
  onDelete: () => void;
}>) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Options">
            <Cog className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => navigate(`/departments/${department.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {department.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this department? This action cannot be undone.</p>
              <span className="flex flex-col gap-2 mt-2">
                <Button variant="destructive" className="w-full text-white" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
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
