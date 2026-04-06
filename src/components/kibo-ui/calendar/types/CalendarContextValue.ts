import { Accessor, Setter } from 'solid-js';
import { CalendarViewMode } from '~/components/kibo-ui/calendar/types/CalendarViewMode';
import { CalendarState } from '~/components/kibo-ui/calendar/types/CalendarState';

export type CalendarContextValue = {
  locale: Intl.LocalesArgument;
  startDay: number;
  month: Accessor<CalendarState['month']>;
  setMonth: Setter<CalendarState['month']>;
  year: Accessor<number>;
  setYear: Setter<number>;

  view: Accessor<CalendarViewMode>;
  setView: Setter<CalendarViewMode>;

  selectedDate: Accessor<Date>;
  setSelectedDate: Setter<Date>;
};
