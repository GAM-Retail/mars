import { createSignal, JSX } from 'solid-js';
import { cn } from '~/lib/utils';
import {
  CalendarContextValue,
  CalendarState,
  CalendarViewMode,
} from '~/components/kibo-ui/calendar/types';
import { CalendarContext } from '../context/CalendarContext';

type CalendarContextProps = {
  locale?: Intl.LocalesArgument;
  startDay?: number;
  class?: string;
  children?: JSX.Element;
};

export function CalendarProvider(props: Readonly<CalendarContextProps>): JSX.Element {
  const [month, setMonth] = createSignal<CalendarState['month']>(
    new Date().getMonth() as CalendarState['month'],
  );

  const [year, setYear] = createSignal<number>(new Date().getFullYear());

  const [view, setView] = createSignal<CalendarViewMode>('month');
  const [selectedDate, setSelectedDate] = createSignal(new Date());

  const value: CalendarContextValue = {
    get locale() {
      return props.locale ?? 'en-US';
    },
    get startDay() {
      return props.startDay ?? 0;
    },
    month,
    setMonth,
    year,
    setYear,
    view,
    setView,
    selectedDate,
    setSelectedDate,
  };

  return (
    <CalendarContext.Provider value={value}>
      <div class={cn('relative flex flex-col', props.class)}>{props.children}</div>
    </CalendarContext.Provider>
  );
}
