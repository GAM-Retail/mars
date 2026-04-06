import { createMemo, For, JSX } from 'solid-js';
import { cn } from '~/lib/utils';
import { useCalendarContext } from '~/components/kibo-ui/calendar/hooks/useCalendarContext';
import { daysForLocale } from '~/components/kibo-ui/calendar/libs/utils';

type CalendarDateProps = {
  children?: JSX.Element;
};

export function CalendarDate(props: Readonly<CalendarDateProps>): JSX.Element {
  return <div class="flex items-center justify-between p-3">{props.children}</div>;
}

type CalendarHeaderProps = {
  class?: string;
};

export function CalendarHeader(props: Readonly<CalendarHeaderProps>): JSX.Element {
  const { locale, startDay } = useCalendarContext();

  const daysData = createMemo(() => daysForLocale(locale, startDay));

  return (
    <div class={cn('grid grow grid-cols-7', props.class)}>
      <For each={daysData()}>
        {(day) => <div class="p-3 text-right text-muted-foreground text-xs">{day}</div>}
      </For>
    </div>
  );
}
