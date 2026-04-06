import { Feature } from '~/components/kibo-ui/calendar/types';
import { JSX } from 'solid-js';
import { cn } from '~/lib/utils';

type CalendarItemProps = {
  feature: Feature;
  class?: string;
};

export function CalendarItem(props: Readonly<CalendarItemProps>): JSX.Element {
  return (
    <div class={cn('flex items-center gap-2', props.class)}>
      <div
        class="h-2 w-2 shrink-0 rounded-full"
        style={{ 'background-color': props.feature.status.color }}
      />
      <span class="truncate">{props.feature.name}</span>
    </div>
  );
}
