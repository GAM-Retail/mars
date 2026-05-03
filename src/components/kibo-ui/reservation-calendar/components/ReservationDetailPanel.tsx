import { Show, type JSX, createMemo } from 'solid-js';
import { format, differenceInMinutes } from 'date-fns';
import { useReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/hooks/useReservationCalendarContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '~/components/ui/sheet';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import type { Reservation } from '~/components/kibo-ui/reservation-calendar/types';

export type ReservationDetailPanelProps = {
  reservations: Reservation[];
  class?: string;
};

function DetailContent(props: Readonly<{ reservation: Reservation }>): JSX.Element {
  const duration = () =>
    differenceInMinutes(props.reservation.endTime, props.reservation.startTime);
  const hours = () => Math.floor(duration() / 60);
  const minutes = () => duration() % 60;

  const formatDuration = () => {
    const h = hours();
    const m = minutes();
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <div class="flex flex-col gap-4">
      <div>
        <h3 class="text-lg font-semibold">{props.reservation.agenda || 'Reservation'}</h3>
        <p class="text-sm text-muted-foreground">ID: {props.reservation.id.slice(0, 8)}</p>
      </div>

      <Separator />

      <div class="space-y-3">
        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Room</p>
          <p class="text-sm">{props.reservation.room.name}</p>
          <p class="text-xs text-muted-foreground">{props.reservation.room.location}</p>
        </div>

        <Separator />

        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Time</p>
          <p class="text-sm">
            {format(props.reservation.startTime, 'h:mm a')} -{' '}
            {format(props.reservation.endTime, 'h:mm a')}
          </p>
          <p class="text-xs text-muted-foreground">Duration: {formatDuration()}</p>
        </div>

        <Separator />

        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Organizer</p>
          <p class="text-sm">{props.reservation.organizer.name}</p>
          <p class="text-xs text-muted-foreground">{props.reservation.organizer.email}</p>
          <Show when={props.reservation.organizer.department}>
            <p class="text-xs text-muted-foreground">{props.reservation.organizer.department}</p>
          </Show>
        </div>

        <Separator />

        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">Reserved By</p>
          <p class="text-sm">{props.reservation.reservedBy.name}</p>
          <p class="text-xs text-muted-foreground">{props.reservation.reservedBy.email}</p>
        </div>

        <Show when={props.reservation.room.capacity}>
          <Separator />
          <div class="space-y-1">
            <p class="text-xs font-medium text-muted-foreground">Capacity</p>
            <p class="text-sm">{props.reservation.room.capacity} people</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

function EmptyState(): JSX.Element {
  return (
    <div class="flex h-full items-center justify-center p-4 text-center">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">No reservation selected</p>
        <p class="text-xs text-muted-foreground">Click on a reservation to view details</p>
      </div>
    </div>
  );
}

export function ReservationDetailPanel(props: Readonly<ReservationDetailPanelProps>): JSX.Element {
  const { selectedReservationId, setSelectedReservationId, setDetailPanelOpen, isDetailPanelOpen } =
    useReservationCalendarContext();

  const selectedReservation = createMemo(() => {
    const id = selectedReservationId();
    if (!id) return null;
    return props.reservations.find((res) => res.id === id) ?? null;
  });

  const closePanel = () => {
    setSelectedReservationId(null);
    setDetailPanelOpen(false);
  };

  const desktopPanel = (
    <div class={cn('hidden md:flex md:w-80 md:flex-col md:border-l bg-background', props.class)}>
      <div class="p-4">
        <h2 class="text-lg font-semibold">Reservation Details</h2>
      </div>
      <Separator />
      <div class="flex-1 h-full overflow-y-auto p-4">
        <Show when={selectedReservation()} fallback={<EmptyState />}>
          {(reservation) => <DetailContent reservation={reservation()} />}
        </Show>
      </div>
    </div>
  );

  const mobileSheet = (
    <Sheet open={isDetailPanelOpen()} onOpenChange={(open) => !open && closePanel()}>
      <SheetContent position="right">
        <SheetHeader>
          <SheetTitle>Reservation Details</SheetTitle>
          <SheetDescription>
            {selectedReservation() ? '' : 'Select a reservation to view details'}
          </SheetDescription>
        </SheetHeader>
        <Show when={selectedReservation()} fallback={<EmptyState />}>
          {(reservation) => <DetailContent reservation={reservation()} />}
        </Show>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {desktopPanel}
      {mobileSheet}
    </>
  );
}
