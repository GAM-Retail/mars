import { useMemo } from 'react';
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

function DetailContent(props: Readonly<{ reservation: Reservation }>) {
  const duration = differenceInMinutes(props.reservation.endTime, props.reservation.startTime);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const formatDuration = () => {
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold">{props.reservation.agenda || 'Reservation'}</h3>
        <p className="text-sm text-muted-foreground">ID: {props.reservation.id.slice(0, 8)}</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Room</p>
          <p className="text-sm">{props.reservation.room.name}</p>
          <p className="text-xs text-muted-foreground">{props.reservation.room.location}</p>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Time</p>
          <p className="text-sm">
            {format(props.reservation.startTime, 'h:mm a')} -{' '}
            {format(props.reservation.endTime, 'h:mm a')}
          </p>
          <p className="text-xs text-muted-foreground">Duration: {formatDuration()}</p>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Organizer</p>
          <p className="text-sm">{props.reservation.organizer.name}</p>
          <p className="text-xs text-muted-foreground">{props.reservation.organizer.email}</p>
          {props.reservation.organizer.department && (
            <p className="text-xs text-muted-foreground">
              {props.reservation.organizer.department.name}
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Reserved By</p>
          <p className="text-sm">{props.reservation.reservedBy.name}</p>
          <p className="text-xs text-muted-foreground">{props.reservation.reservedBy.email}</p>
          <p className="text-xs text-muted-foreground">{props.reservation.reservedBy.ext}</p>
        </div>

        {!!props.reservation.room.capacity && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Capacity</p>
              <p className="text-sm">{props.reservation.room.capacity} people</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-4 text-center">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">No reservation selected</p>
        <p className="text-xs text-muted-foreground">Click on a reservation to view details</p>
      </div>
    </div>
  );
}

export function ReservationDetailPanel(props: Readonly<ReservationDetailPanelProps>) {
  const { selectedReservationId, setSelectedReservationId, setDetailPanelOpen, isDetailPanelOpen } =
    useReservationCalendarContext();

  const selectedReservation = useMemo(() => {
    if (!selectedReservationId) return null;
    return props.reservations.find((res) => res.id === selectedReservationId) ?? null;
  }, [selectedReservationId, props.reservations]);

  const closePanel = () => {
    setSelectedReservationId(null);
    setDetailPanelOpen(false);
  };

  const desktopPanel = (
    <div
      className={cn('hidden md:flex md:w-80 md:flex-col md:border-l bg-background', props.class)}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold">Reservation Details</h2>
      </div>
      <Separator />
      <div className="flex-1 h-full overflow-y-auto p-4">
        {selectedReservation ? <DetailContent reservation={selectedReservation} /> : <EmptyState />}
      </div>
    </div>
  );

  const mobileSheet = (
    <Sheet open={isDetailPanelOpen} onOpenChange={(open) => !open && closePanel()}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Reservation Details</SheetTitle>
          <SheetDescription>
            {selectedReservation ? '' : 'Select a reservations to view details'}
          </SheetDescription>
        </SheetHeader>
        {selectedReservation ? <DetailContent reservation={selectedReservation} /> : <EmptyState />}
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
