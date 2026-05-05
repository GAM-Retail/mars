import { type JSX } from 'solid-js';
import { ReservationCalendarProvider } from '~/components/kibo-ui/reservation-calendar/components/ReservationCalendarProvider';
import { ReservationCalendarHeader } from '~/components/kibo-ui/reservation-calendar/components/ReservationCalendarHeader';
import { ReservationCalendarBody } from '~/components/kibo-ui/reservation-calendar/components/ReservationCalendarBody';
import { ReservationDetailPanel } from '~/components/kibo-ui/reservation-calendar/components/ReservationDetailPanel';
import { cn } from '~/lib/utils';
import type { Reservation } from '~/components/kibo-ui/reservation-calendar/types';

export type ReservationCalendarProps = {
  reservations: Reservation[];
  class?: string;
  locale?: Intl.LocalesArgument;
  startDay?: number;
};

function ReservationCalendarInner(props: Readonly<{ reservations: Reservation[] }>): JSX.Element {
  return (
    <div class="flex h-full flex-col">
      <ReservationCalendarHeader />
      <ReservationCalendarBody reservations={props.reservations} />
    </div>
  );
}

export function ReservationCalendar(props: Readonly<ReservationCalendarProps>): JSX.Element {
  return (
    <ReservationCalendarProvider locale={props.locale} startDay={props.startDay}>
      <div class={cn('flex h-full flex-col md:flex-row', props.class)}>
        <div class="flex-1 min-h-full min-w-0">
          <ReservationCalendarInner reservations={props.reservations} />
        </div>
        <ReservationDetailPanel reservations={props.reservations} />
      </div>
    </ReservationCalendarProvider>
  );
}
