import { createContext } from 'react';
import type { ReservationCalendarContextValue } from '~/components/kibo-ui/reservation-calendar/types';

export const ReservationCalendarContext = createContext<ReservationCalendarContextValue | null>(null);
