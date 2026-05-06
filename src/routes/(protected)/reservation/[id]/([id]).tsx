import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
  revalidate,
} from '@solidjs/router';
import { Show, createSignal } from 'solid-js';
import { Calendar, Cog, MapPin, User as UserIcon, Mail, Phone, Building2 } from 'lucide-solid';
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
import { toast } from 'solid-sonner';
import {
  getReservationByIdController,
  deleteReservationAction,
} from '~/server/controller/reservation.server';
import { UserRole } from '~/types';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { cn } from '~/lib/utils';

export const route = {
  info: {
    title: 'Reservation',
    description: 'Reservation Detail',
    breadcrumb: {
      href: '/reservation',
      label: 'Reservations',
    },
    newButtonState: {
      label: 'New Reservation',
      href: '/reservation/new',
      role: [UserRole.ADMIN],
    },
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function ReservationDetail() {
  const userContext = useCurrentUser();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteReservation = useAction(deleteReservationAction);
  const [open, setOpen] = createSignal(false);

  const data = createAsync(() => getReservationByIdController(params.id));

  const onDelete = async () => {
    try {
      await deleteReservation(params.id);
      await revalidate('getAllReservationsForCalendar');
      toast('Reservation has been deleted', {
        description: 'Reservation has been deleted successfully.',
      });
      navigate('/reservation');
    } catch (error) {
      toast('Failed to delete reservation', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <Show when={data()}>
      {(d) => {
        const res = d().reservation;
        return (
          <div class="mt-10 px-4 flex flex-col gap-6">
            <div class="flex justify-between items-stretch border-b pb-4">
              <div>
                <p class="text-sm text-muted-foreground">Reservation</p>
                <h1 class="text-3xl font-semibold tracking-tight">{res.room.name}</h1>
              </div>
              <div
                class={cn(
                  'flex flex-col min-h-full items-end',
                  userContext.currentUser?.role === UserRole.ADMIN
                    ? 'justify-between'
                    : 'justify-end',
                )}
              >
                <DropdownMenu placement="right">
                  <DropdownMenuTrigger class="flex item-start" aria-label="Options">
                    <Cog class="h-6 w-6" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      as={A}
                      href={`/reservation/${params.id}/edit`}
                      onSelect={() => navigate(`/reservation/${params.id}/edit`)}
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
                <div class="flex flex-wrap gap-6 text-sm self-end text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <Calendar class="h-4 w-4" />
                    <span>
                      {res.createdAt.toLocaleString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-6">
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div class="flex flex-col space-y-1.5 p-6 pb-4">
                    <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Calendar class="h-5 w-5 text-muted-foreground" />
                      Time Slot
                    </h3>
                  </div>
                  <div class="p-6 pt-0 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <p class="text-xs text-muted-foreground">Start Time</p>
                        <p class="text-sm font-medium">
                          {res.startTime.toLocaleString('id-ID', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <p class="text-xs text-muted-foreground">End Time</p>
                        <p class="text-sm font-medium">
                          {res.endTime.toLocaleString('id-ID', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <Show when={res.agenda}>
                      <div class="space-y-2">
                        <p class="text-xs text-muted-foreground">Agenda</p>
                        <p class="text-sm">{res.agenda}</p>
                      </div>
                    </Show>
                  </div>
                </div>

                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div class="flex flex-col space-y-1.5 p-6 pb-4">
                    <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                      <UserIcon class="h-5 w-5 text-muted-foreground" />
                      Organizer Details
                    </h3>
                  </div>
                  <div class="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-muted-foreground">
                        <UserIcon class="h-4 w-4" />
                        <p class="text-xs">NIK</p>
                      </div>
                      <p class="text-sm font-medium">{res.organizer.nik}</p>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-muted-foreground">
                        <UserIcon class="h-4 w-4" />
                        <p class="text-xs">Name</p>
                      </div>
                      <p class="text-sm font-medium">{res.organizer.name}</p>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-muted-foreground">
                        <Mail class="h-4 w-4" />
                        <p class="text-xs">Email</p>
                      </div>
                      <p class="text-sm font-medium">{res.organizer.email}</p>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-muted-foreground">
                        <Phone class="h-4 w-4" />
                        <p class="text-xs">Phone</p>
                      </div>
                      <p class="text-sm font-medium">{res.organizer.phone}</p>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-muted-foreground">
                        <Building2 class="h-4 w-4" />
                        <p class="text-xs">Division</p>
                      </div>
                      <p class="text-sm font-medium">{res.organizer.division || '-'}</p>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-muted-foreground">
                        <Building2 class="h-4 w-4" />
                        <p class="text-xs">Department</p>
                      </div>
                      <p class="text-sm font-medium">{res.organizer.department || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div class="flex flex-col space-y-1.5 p-6 pb-4">
                    <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                      <MapPin class="h-5 w-5 text-muted-foreground" />
                      Room Info
                    </h3>
                  </div>
                  <div class="p-6 pt-0 space-y-4">
                    <div class="space-y-2">
                      <p class="text-xs text-muted-foreground">Room Name</p>
                      <p class="text-sm font-medium">{res.room.name}</p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-xs text-muted-foreground">Location</p>
                      <p class="text-sm">{res.room.location}</p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-xs text-muted-foreground">Capacity</p>
                      <p class="text-sm">{res.room.capacity} people</p>
                    </div>
                  </div>
                </div>

                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div class="flex flex-col space-y-1.5 p-6 pb-4">
                    <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                      <UserIcon class="h-5 w-5 text-muted-foreground" />
                      Reserved By
                    </h3>
                  </div>
                  <div class="p-6 pt-0 space-y-4">
                    <div class="space-y-2">
                      <p class="text-xs text-muted-foreground">Name</p>
                      <p class="text-sm font-medium">{res.reservedBy.name}</p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-xs text-muted-foreground">Email</p>
                      <p class="text-sm">{res.reservedBy.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AlertDialog open={open()} onOpenChange={setOpen} modal>
              <AlertDialogContent>
                <AlertDialogTitle>Delete Reservation</AlertDialogTitle>
                <AlertDialogDescription>
                  <div>
                    <p>
                      Are you sure you want to delete this reservation? This action cannot be
                      undone.
                    </p>
                    <span>
                      <Button
                        variant="destructive"
                        class="w-full mt-2 text-white"
                        onClick={onDelete}
                      >
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
          </div>
        );
      }}
    </Show>
  );
}
