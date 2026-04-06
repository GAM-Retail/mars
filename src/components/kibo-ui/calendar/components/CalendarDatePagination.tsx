import { JSX } from 'solid-js';
import { cn } from '~/lib/utils';
import { useCalendarMonth } from '~/components/kibo-ui/calendar/hooks/useCalendarMonth';
import { useCalendarYear } from '~/components/kibo-ui/calendar/hooks/useCalendarYear';
import { CalendarState } from '~/components/kibo-ui/calendar/types';
import { Button } from '~/components/ui/button';

type CalendarDatePaginationProps = {
  class?: string;
};

export function CalendarDatePagination(props: Readonly<CalendarDatePaginationProps>): JSX.Element {
  const [month, setMonth] = useCalendarMonth();
  const [year, setYear] = useCalendarYear();

  const handlePreviousMonth = () => {
    const currentMonth = month();
    const currentYear = year();
    if (currentMonth === 0) {
      setMonth(11);
      setYear(currentYear - 1);
    } else {
      setMonth((currentMonth - 1) as CalendarState['month']);
    }
  };

  const handleNextMonth = () => {
    const currentMonth = month();
    const currentYear = year();
    if (currentMonth === 11) {
      setMonth(0);
      setYear(currentYear + 1);
    } else {
      setMonth((currentMonth + 1) as CalendarState['month']);
    }
  };

  return (
    <div class={cn('flex items-center gap-2', props.class)}>
      <Button onClick={handlePreviousMonth} size="icon" variant="ghost">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Button>
      <Button onClick={handleNextMonth} size="icon" variant="ghost">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>
    </div>
  );
}
