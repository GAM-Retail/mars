import { ReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/context/ReservationCalendarContext';
import { useContext } from 'solid-js';
import type { ReservationCalendarContextValue } from '~/components/kibo-ui/reservation-calendar/types';

export function useReservationCalendarContext(): ReservationCalendarContextValue {
  const context = useContext(ReservationCalendarContext);
  if (!context) {
    throw new Error('ReservationCalendarContext not found');
  }
  return context;
}
