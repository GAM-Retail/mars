import { useContext } from 'react';
import { ReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/context/ReservationCalendarContext';
import type { ReservationCalendarContextValue } from '~/components/kibo-ui/reservation-calendar/types';

export function useReservationCalendarContext(): ReservationCalendarContextValue {
  const context = useContext(ReservationCalendarContext);
  if (!context) {
    throw new Error('ReservationCalendarContext not found');
  }
  return context;
}
