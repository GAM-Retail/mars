import { createContext } from 'solid-js';
import type { ReservationCalendarContextValue } from '~/components/kibo-ui/reservation-calendar/types';

export const ReservationCalendarContext = createContext<ReservationCalendarContextValue>();
