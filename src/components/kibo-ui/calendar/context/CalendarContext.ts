import { createContext } from 'solid-js';
import { CalendarContextValue } from '~/components/kibo-ui/calendar/types/CalendarContextValue';

export const CalendarContext = createContext<CalendarContextValue>();
