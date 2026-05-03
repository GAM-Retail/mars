import { type JSX } from 'solid-js';
import { Button } from '~/components/ui/button';
import { useReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/hooks/useReservationCalendarContext';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { cn } from '~/lib/utils';

export type ReservationCalendarHeaderProps = {
  class?: string;
};

export function ReservationCalendarHeader(
  props: Readonly<ReservationCalendarHeaderProps>,
): JSX.Element {
  const { view, selectedDate, setSelectedDate, setMonth, setYear, setView } =
    useReservationCalendarContext();

  const navigatePrev = () => {
    const current = selectedDate();
    if (view() === 'month') {
      const prev = subMonths(current, 1);
      setSelectedDate(prev);
      setMonth(prev.getMonth());
      setYear(prev.getFullYear());
    } else if (view() === 'week') {
      setSelectedDate(subWeeks(current, 1));
    } else {
      setSelectedDate(subDays(current, 1));
    }
  };

  const navigateNext = () => {
    const current = selectedDate();
    if (view() === 'month') {
      const next = addMonths(current, 1);
      setSelectedDate(next);
      setMonth(next.getMonth());
      setYear(next.getFullYear());
    } else if (view() === 'week') {
      setSelectedDate(addWeeks(current, 1));
    } else {
      setSelectedDate(addDays(current, 1));
    }
  };

  const navigateToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const title = () => {
    const date = selectedDate();
    if (view() === 'month') {
      return format(date, 'MMMM yyyy');
    } else if (view() === 'week') {
      return format(date, 'MMM d, yyyy');
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div class={cn('flex items-center justify-between border-b p-2', props.class)}>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={navigateToday}>
          Today
        </Button>
        <div class="flex items-center">
          <Button variant="ghost" size="icon" onClick={navigatePrev} class="size-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext} class="size-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
        <h2 class="text-lg font-semibold">{title()}</h2>
      </div>
      <div class="flex items-center gap-1 rounded-md border p-1">
        <Button
          variant={view() === 'month' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setView('month')}
        >
          Month
        </Button>
        <Button
          variant={view() === 'week' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setView('week')}
        >
          Week
        </Button>
        <Button
          variant={view() === 'day' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setView('day')}
        >
          Day
        </Button>
      </div>
    </div>
  );
}
