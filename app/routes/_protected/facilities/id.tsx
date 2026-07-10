import { useEffect, useState } from 'react';
import { Link, useLoaderData, useFetcher, useNavigate } from 'react-router';
import { CalendarPlus, CircleUser, Building, Cog } from 'lucide-react';
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
import { toast } from 'sonner';

import {
  getFacilityById,
  getRoomsByFacilityId,
  deleteFacilityById,
  getFacilityByIdRaw,
} from '~/lib/services/facility.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ params }: { params: { id: string } }) {
  const { facility } = await getFacilityById(params.id);
  const { roomFacilities } = await getRoomsByFacilityId(params.id);
  return { facility, roomFacilities };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    const facility = await getFacilityByIdRaw(params.id);
    if (!facility) return { success: false, message: 'Facility not found' };
    if (facility.createdBy !== user.id)
      return { success: false, message: 'You do not have permission' };
    await deleteFacilityById(params.id);
    return { deleted: true };
  } catch (err) {
    return catchResult(err);
  }
}

export default function DetailFacility() {
  const { facility, roomFacilities } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const deleteFetcher = useFetcher();

  useEffect(() => {
    if (deleteFetcher.data?.deleted) {
      toast.success('Facility has been deleted');
      navigate('/facilities');
    }
  }, [deleteFetcher.data, navigate]);

  const onDelete = () => {
    deleteFetcher.submit(null, { method: 'delete' });
  };

  return (
    <div className="mt-10 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-stretch border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Facility</p>
          <h1 className="text-3xl font-semibold tracking-tight">{facility.name}</h1>
        </div>
        <div className="flex flex-col items-end justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Options">
                <Cog className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => navigate(`/facilities/${facility.id}/edit`)}>
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
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CircleUser className="h-4 w-4" />
              <span>{facility.createdBy || 'System'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              <span>
                {facility.createdAt.toLocaleString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                } as Intl.DateTimeFormatOptions)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{facility.description || '-'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Rooms with this facility</p>
            {roomFacilities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No rooms have this facility</p>
            ) : (
              <div className="relative">
                <div className="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
                  {roomFacilities.map((rf) => (
                    <Link
                      key={rf.id}
                      to={`/rooms/${rf.room.id}`}
                      className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors"
                    >
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{rf.room.name}</span>
                        <span className="text-xs text-muted-foreground">{rf.room.location}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {facility.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Are you sure you want to delete this facility? This action cannot be undone.</p>
              <span>
                <Button variant="destructive" className="w-full mt-2 text-white" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" className="w-full mt-2" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
