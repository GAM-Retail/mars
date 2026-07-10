import { ReservationCalendarProvider } from '~/components/kibo-ui/reservation-calendar/components/ReservationCalendarProvider';
import { ReservationCalendarHeader } from '~/components/kibo-ui/reservation-calendar/components/ReservationCalendarHeader';
import { ReservationCalendarBody } from '~/components/kibo-ui/reservation-calendar/components/ReservationCalendarBody';
import { ReservationDetailPanel } from '~/components/kibo-ui/reservation-calendar/components/ReservationDetailPanel';
import { cn } from '~/lib/utils';
import type { Reservation } from '~/components/kibo-ui/reservation-calendar/types';

export type ReservationCalendarProps = {
  reservations: Reservation[];
  className?: string;
  locale?: Intl.LocalesArgument;
  startDay?: number;
};

function ReservationCalendarInner(props: Readonly<{ reservations: Reservation[] }>) {
  return (
    <div className="flex h-full flex-col">
      <ReservationCalendarHeader />
      <ReservationCalendarBody reservations={props.reservations} />
    </div>
  );
}

export function ReservationCalendar(props: Readonly<ReservationCalendarProps>) {
  return (
    <ReservationCalendarProvider locale={props.locale} startDay={props.startDay}>
      <div className={cn('flex h-full flex-col md:flex-row', props.className)}>
        <div className="flex-1 min-h-full min-w-0">
          <ReservationCalendarInner reservations={props.reservations} />
        </div>
        <ReservationDetailPanel reservations={props.reservations} />
      </div>
    </ReservationCalendarProvider>
  );
}
