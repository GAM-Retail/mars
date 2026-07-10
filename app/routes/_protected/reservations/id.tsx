import { useEffect, useState } from 'react';
import { useLoaderData, useFetcher, Link, useNavigate } from 'react-router';
import {
  Calendar,
  Cog,
  MapPin,
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  History,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
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
import { Badge } from '~/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { toast } from 'sonner';

import {
  getReservationById,
  getReservationLogsController,
  deleteReservationAction,
} from '~/lib/services/reservation.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { isPersonInCharge } from '~/lib/services/room.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  const user = await getCurrentUser(request);
  const reservation = await getReservationById(params.id);
  if (!reservation) throw new Error('Reservation does not exist');
  if (user.role !== 'SUPERADMIN') {
    const isPic = await isPersonInCharge(user.id, reservation.roomId);
    if (!isPic) throw new Error('You are not the person in charge for this rooms');
  }
  const logs = await getReservationLogsController(request, params.id);
  return { reservation, logs };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  try {
    await deleteReservationAction(request, params.id);
    return { success: true };
  } catch (err) {
    return catchResult(err);
  }
}

export default function ReservationDetails() {
  const { reservation, logs } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success('Reservation has been deleted');
      navigate('/reservations', { replace: true });
    }
    if (fetcher.data?.success === false) {
      const message = (fetcher.data as Record<string, unknown>).message as string | undefined;
      toast.error('Failed to delete reservation', { description: message });
      setDeleteOpen(false);
    }
  }, [fetcher.data, navigate]);
  const [activityOpen, setActivityOpen] = useState(false);

  const canModify = !reservation.deletedAt && new Date(reservation.endTime) > new Date();
  const isDeleting = fetcher.state !== 'idle';

  const res = reservation;

  const formatUpdateChanges = (changes: unknown) => {
    const d = new Date(changes as string);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return String(changes);
  };

  return (
    <div className="mt-10 px-4 flex flex-col gap-6 pb-2">
      <div className="flex justify-between items-stretch border-b pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-muted-foreground">Reservation</p>
            {res.deletedAt && (
              <Badge variant="destructive" className="text-xs">
                Deleted
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{res.room.name}</h1>
          {res.deletedAt && (
            <p className="text-sm text-muted-foreground mt-1">
              Deleted on{' '}
              {new Date(res.deletedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Options">
                <Cog className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild disabled={!canModify}>
                <Link to={`/reservations/${res.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
                disabled={!canModify}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(res.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Time Slot
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="text-sm font-medium">
                    {new Date(res.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="text-sm font-medium">
                    {new Date(res.endTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              {res.agenda && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Agenda</p>
                  <p className="text-sm">{res.agenda}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                Organizer Details
              </h3>
            </div>
            <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <p className="text-xs">NIK</p>
                </div>
                <p className="text-sm font-medium">{res.organizer.nik}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <p className="text-xs">Name</p>
                </div>
                <p className="text-sm font-medium">{res.organizer.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <p className="text-xs">Email</p>
                </div>
                <p className="text-sm font-medium">{res.organizer.email}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <p className="text-xs">Phone</p>
                </div>
                <p className="text-sm font-medium">{res.organizer.phone}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <p className="text-xs">Division</p>
                </div>
                <p className="text-sm font-medium">{res.organizer.division?.name || '-'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <p className="text-xs">Department</p>
                </div>
                <p className="text-sm font-medium">{res.organizer.department?.name || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Room Info
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Room Name</p>
                <p className="text-sm font-medium">{res.room.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm">{res.room.location}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm">{res.room.capacity} people</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                Reserved By
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{res.reservedBy.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{res.reservedBy.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Collapsible
        open={activityOpen}
        onOpenChange={setActivityOpen}
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Activity</span>
            <span className="text-xs text-muted-foreground">({logs?.length || 0})</span>
          </div>
          {activityOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-2 py-1.5 text-sm hover:bg-muted/50 rounded px-2 -mx-2"
                >
                  <span className="text-xs text-muted-foreground shrink-0 w-24">
                    {new Date(log.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium',
                        log.action === 'CREATE' &&
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                        log.action === 'UPDATE' &&
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                        log.action === 'DELETE' &&
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                      )}
                    >
                      {log.action}
                    </span>
                  </span>
                  <span className="truncate flex gap-2 items-center">
                    <span className="font-medium">{log.performedByName || log.performedBy}</span>
                    <span className="text-muted-foreground">
                      {log.action === 'CREATE' && 'created reservations'}
                      {log.action === 'DELETE' && 'deleted reservations'}
                      {log.action === 'UPDATE' && (
                        <>
                          updated reservation
                          {log.changes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-auto px-1 text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  changes
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2 text-xs">
                                  <p className="font-medium text-sm border-b pb-2">Changes</p>
                                  {log.changes &&
                                    typeof log.changes === 'object' &&
                                    'after' in (log.changes as Record<string, unknown>) &&
                                    (() => {
                                      const changes = log.changes as {
                                        before?: Record<string, unknown>;
                                        after: Record<string, unknown>;
                                      };
                                      return Object.entries(changes.after).map(
                                        ([key, afterValue]) => {
                                          const beforeValue = changes.before?.[key];
                                          if (beforeValue === afterValue) return null;
                                          return (
                                            <div
                                              key={key}
                                              className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1"
                                            >
                                              <span className="text-muted-foreground capitalize">
                                                {key}:
                                              </span>
                                              <span>
                                                <span className="line-through text-muted-foreground mr-1">
                                                  {formatUpdateChanges(beforeValue)}
                                                </span>
                                                <span className="mx-1">→</span>
                                                <span className="font-medium">
                                                  {formatUpdateChanges(afterValue)}
                                                </span>
                                              </span>
                                            </div>
                                          );
                                        },
                                      );
                                    })()}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </>
                      )}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Reservation</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Are you sure you want to delete this reservation? This action cannot be undone.</p>
            <div className="flex flex-col gap-2 mt-2">
              <Button
                variant="destructive"
                className="w-full text-white"
                disabled={isDeleting}
                onClick={() => fetcher.submit(res.id, { method: 'post' })}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
