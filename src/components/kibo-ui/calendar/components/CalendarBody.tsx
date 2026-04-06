import { createMemo, type JSX, For, Show } from 'solid-js';
import { useCalendarMonth } from '../hooks/useCalendarMonth';
import { useCalendarYear } from '../hooks/useCalendarYear';
import { useCalendarContext } from '../hooks/useCalendarContext';
import { cn } from '~/lib/utils';
import { getDay, getDaysInMonth, isSameDay } from 'date-fns';
import { Feature } from '~/components/kibo-ui/calendar/types';

type OutOfBoundsDayProps = {
  day: number;
};

const OutOfBoundsDay = (props: OutOfBoundsDayProps): JSX.Element => (
  <div class="relative h-full w-full bg-secondary p-1 text-muted-foreground text-xs">
    {props.day}
  </div>
);

export type CalendarBodyProps = {
  features: Feature[];
  children?: (props: { feature: Feature }) => JSX.Element;
};
export function CalendarBody(props: Readonly<CalendarBodyProps>): JSX.Element {
  const [month] = useCalendarMonth();
  const [year] = useCalendarYear();
  const { startDay } = useCalendarContext();

  const currentMonthDate = createMemo(() => new Date(year(), month(), 1));
  const daysInMonth = createMemo(() => getDaysInMonth(currentMonthDate()));
  const firstDay = createMemo(() => (getDay(currentMonthDate()) - startDay + 7) % 7);

  const prevMonthData = createMemo(() => {
    const m = month();
    const y = year();
    const prevMonth = m === 0 ? 11 : m - 1;
    const prevMonthYear = m === 0 ? y - 1 : y;
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
    const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (_, i) => i + 1);
    return { prevMonthDays, prevMonthDaysArray };
  });

  const nextMonthData = createMemo(() => {
    const m = month();
    const y = year();
    const nextMonth = m === 11 ? 0 : m + 1;
    const nextMonthYear = m === 11 ? y + 1 : y;
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, i) => i + 1);
    return { nextMonthDaysArray };
  });

  const featuresByDay = createMemo(() => {
    const m = month();
    const y = year();
    const d = daysInMonth();
    const result: Record<number, Feature[]> = {};
    for (let day = 1; day <= d; day++) {
      result[day] = props.features.filter((feature) => {
        return isSameDay(feature.endAt, new Date(y, m, day));
      });
    }
    return result;
  });

  const prevDays = createMemo(() => {
    const result: JSX.Element[] = [];
    const fDay = firstDay();
    const pd = prevMonthData();

    for (let i = 0; i < fDay; i++) {
      const day = pd.prevMonthDaysArray[pd.prevMonthDays - fDay + i];
      if (day) {
        result.push(<OutOfBoundsDay day={day} />);
      }
    }
    return result;
  });

  const currentDays = createMemo(() => {
    const dm = daysInMonth();
    const result: JSX.Element[] = [];

    const handler = (day: number) => {
      const { setSelectedDate, setView } = useCalendarContext();
      setSelectedDate(new Date(year(), month(), day));
      setView('day');
    };
    for (let day = 1; day <= dm; day++) {
      const featuresForDay = featuresByDay()[day] || [];
      result.push(
        <div
          role="group"
          class="relative flex h-full w-full flex-col gap-1 p-1 text-muted-foreground text-xs"
          onClick={() => handler(day)}
          onKeyDown={() => handler(day)}
        >
          {day}
          <div>
            {props.children && (
              <For each={featuresForDay.slice(0, 3)}>
                {(feature) => props.children?.({ feature })}
              </For>
            )}
          </div>
          <Show when={featuresForDay.length > 3}>
            <span class="block text-muted-foreground text-xs">
              +{featuresForDay.length - 3} more
            </span>
          </Show>
        </div>,
      );
    }
    return result;
  });

  const nextDays = createMemo(() => {
    const result: JSX.Element[] = [];
    const fDay = firstDay();
    const dm = daysInMonth();
    const nd = nextMonthData();

    const remainingDays = 7 - ((fDay + dm) % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        const day = nd.nextMonthDaysArray[i];
        if (day) {
          result.push(<OutOfBoundsDay day={day} />);
        }
      }
    }
    return result;
  });

  return (
    <div class="grid grow grid-cols-7">
      <For each={prevDays()}>
        {(day) => <div class="relative aspect-square overflow-hidden border-t border-r">{day}</div>}
      </For>
      <For each={currentDays()}>
        {(day, index) => (
          <div
            class={cn(
              'relative aspect-square overflow-hidden border-t border-r',
              index() % 7 === 6 && 'border-r-0',
            )}
          >
            {day}
          </div>
        )}
      </For>
      <For each={nextDays()}>
        {(day) => <div class="relative aspect-square overflow-hidden border-t border-r">{day}</div>}
      </For>
    </div>
  );
}
