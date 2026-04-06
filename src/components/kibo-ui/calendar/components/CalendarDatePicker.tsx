import { JSX, For } from 'solid-js';
import { useCalendarContext } from '~/components/kibo-ui/calendar/hooks/useCalendarContext';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { CalendarViewMode } from '~/components/kibo-ui/calendar/types';

type CalendarDatePickerProps = {
  class?: string;
  children?: JSX.Element;
};

export function CalendarDatePicker(props: Readonly<CalendarDatePickerProps>): JSX.Element {
  return <div class={cn('flex items-center gap-1 grow', props.class)}>{props.children}</div>;
}

export function CalendarViewSwitcher() {
  const { view, setView } = useCalendarContext();

  return (
    <div class="flex gap-1">
      <For each={['month', 'week', 'day']}>
        {(v) => (
          <Button
            variant={view() === v ? 'default' : 'ghost'}
            onClick={() => setView(v as CalendarViewMode)}
          >
            {v}
          </Button>
        )}
      </For>
    </div>
  );
}
