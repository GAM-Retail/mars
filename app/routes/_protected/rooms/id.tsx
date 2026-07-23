import { useEffect, useState } from 'react';
import { useLoaderData, useFetcher, Link, useNavigate } from 'react-router';
import { CalendarPlus, CircleUser, Cog } from 'lucide-react';
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
import SearchableSheet from '~/components/SearchableSheet';
import { toast } from 'sonner';

import {
  getRoomById,
  getAllFacilitiesForRoom,
  deleteRoomById,
  addFacilityToRoom,
  removeFacilityFromRoom,
  addPersonInCharge,
  removePersonInCharge,
  getRoomByIdRaw,
} from '~/lib/services/room.server';
import { getCurrentUser, requireSuperAdmin } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';
import db from '~/lib/db';

export async function loader({ params }: { request: Request; params: { id: string } }) {
  const [roomResult, facilitiesResult, allUsers] = await Promise.all([
    getRoomById(params.id),
    getAllFacilitiesForRoom(),
    db.user.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);
  return {
    room: roomResult.room,
    allFacilities: facilitiesResult.facilities,
    allUsers,
  };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (request.method === 'DELETE') {
      const room = await getRoomByIdRaw(params.id);
      if (!room) return { success: false, message: 'Room not found' };
      if (room.createdBy !== user.id)
        return { success: false, message: 'You do not have permission' };
      await deleteRoomById(params.id);
      return { deleted: true };
    }
    const formData = await request.formData();
    const intent = formData.get('intent') as string;
    if (intent === 'add-facilities') {
      await requireSuperAdmin(request);
      const room = await getRoomByIdRaw(params.id);
      if (!room) return { success: false, message: 'Room not found' };
      await addFacilityToRoom(params.id, formData.get('facilityId') as string);
      return { success: true };
    }
    if (intent === 'remove-facilities') {
      await requireSuperAdmin(request);
      const room = await getRoomByIdRaw(params.id);
      if (!room) return { success: false, message: 'Room not found' };
      await removeFacilityFromRoom(params.id, formData.get('facilityId') as string);
      return { success: true };
    }
    if (intent === 'add-person-in-charge') {
      const isSuperAdmin = await requireSuperAdmin(request)
        .then(() => true)
        .catch(() => false);
      const room = await getRoomByIdRaw(params.id);
      if (!room) return { success: false, message: 'Room not found' };
      if (room.createdBy !== user.id && !isSuperAdmin)
        return { success: false, message: 'You do not have permission' };
      await addPersonInCharge(params.id, formData.get('userId') as string);
      return { success: true };
    }
    if (intent === 'remove-person-in-charge') {
      await requireSuperAdmin(request);
      const room = await getRoomByIdRaw(params.id);
      if (!room) return { success: false, message: 'Room not found' };
      await removePersonInCharge(params.id, formData.get('userId') as string);
      return { success: true };
    }
    return { success: false };
  } catch (err) {
    return catchResult(request, err);
  }
}

export default function RoomDetails() {
  const { room, allFacilities, allUsers } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const data = fetcher.data as Record<string, unknown> | undefined;
    if (data?.success === false && data?.message) {
      toast.error('Action failed', { description: data.message as string });
      return;
    }
    if (fetcher.data?.deleted) {
      toast.success('Home has been deleted');
      navigate('/rooms');
    }
    if (fetcher.data?.success) {
      toast.success('Home updated');
    }
  }, [fetcher.data, navigate]);

  const selectedFacilities = room.roomFacilities.map(
    (rf: { facilityId: string; facility: { id: string; name: string } }) => ({
      id: rf.facilityId,
      name: rf.facility.name,
    }),
  );

  const selectedPersonInCharge = room.roomPersonInCharges.map(
    (rp: { personInChargeId: string; personInCharge: { id: string; name: string } }) => ({
      id: rp.personInChargeId,
      name: rp.personInCharge.name,
    }),
  );

  const handleAddFacility = (facilityId: string) => {
    const fd = new FormData();
    fd.set('intent', 'add-facilities');
    fd.set('facilityId', facilityId);
    fetcher.submit(fd, { method: 'post' });
  };

  const handleRemoveFacility = (facilityId: string) => {
    const fd = new FormData();
    fd.set('intent', 'remove-facilities');
    fd.set('facilityId', facilityId);
    fetcher.submit(fd, { method: 'post' });
  };

  const handleAddPersonInCharge = (userId: string) => {
    const fd = new FormData();
    fd.set('intent', 'add-person-in-charge');
    fd.set('userId', userId);
    fetcher.submit(fd, { method: 'post' });
  };

  const handleRemovePersonInCharge = (userId: string) => {
    const fd = new FormData();
    fd.set('intent', 'remove-person-in-charge');
    fd.set('userId', userId);
    fetcher.submit(fd, { method: 'post' });
  };

  return (
    <div className="mt-10 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-stretch border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Room</p>
          <h1 className="text-3xl font-semibold tracking-tight">{room.name}</h1>
        </div>
        <div className="flex flex-col items-end justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Options">
                <Cog className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to={`/rooms/${room.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => setDeleteDialogOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CircleUser className="h-4 w-4" />
              <span>{room.createdByUser?.name || 'System'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              <span>
                {new Date(room.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{room.description || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Location</p>
            <p className="text-sm">{room.location}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Capacity</p>
            <p className="text-sm">{room.capacity} people</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Facilities</p>
            <SearchableSheet
              title="Add Facilities"
              description="Search and select facilities to add to this room."
              searchPlaceholder="Search facilities..."
              availableItems={allFacilities}
              selectedItems={selectedFacilities}
              onAdd={handleAddFacility}
              onRemove={handleRemoveFacility}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Person In Charge</p>
            <SearchableSheet
              title="Add Person In Charge"
              description="Search and select a person to be in charge of this room."
              searchPlaceholder="Search users..."
              availableItems={allUsers}
              selectedItems={selectedPersonInCharge}
              onAdd={handleAddPersonInCharge}
              onRemove={handleRemovePersonInCharge}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {room.name}</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Are you sure you want to delete this room? This action cannot be undone.</p>
            <div className="flex flex-col gap-2 mt-2">
              <Button
                variant="destructive"
                className="w-full text-white"
                onClick={() => {
                  fetcher.submit(null, { method: 'delete' });
                }}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
