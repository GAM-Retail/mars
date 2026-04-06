import { CalendarContextValue } from '~/components/kibo-ui/calendar/types';
import { useContext } from 'solid-js';
import { CalendarContext } from '~/components/kibo-ui/calendar/context/CalendarContext';

export function useCalendarContext(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('CalendarContext not found');
  }
  return context;
}
