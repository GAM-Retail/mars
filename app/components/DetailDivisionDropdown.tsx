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

type Division = {
  id: string;
  name: string;
};

export default function DetailDivisionDropdown({
  division,
  onDelete,
}: Readonly<{
  division: Division;
  onDelete: () => void;
}>) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="Options">
          <Button variant="ghost" size="icon">
            <Cog className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => navigate(`/divisions/${division.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-destructive/90 hover:text-destructive-foreground focus:bg-destructive/90 focus:text-destructive-foreground"
            onSelect={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {division.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this division? This action cannot be undone.</p>
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
