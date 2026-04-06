import { useCalendarContext } from '~/components/kibo-ui/calendar/hooks/useCalendarContext';
import { createMemo, For, Show } from 'solid-js';
import { addDays, isSameDay, startOfWeek } from 'date-fns';
import {
  CalendarBody,
  CalendarBodyProps,
} from '~/components/kibo-ui/calendar/components/CalendarBody';

function CalendarWeekView(props: Readonly<CalendarBodyProps>) {
  const { selectedDate, startDay } = useCalendarContext();

  const weekDays = createMemo(() => {
    const start = startOfWeek(selectedDate(), { weekStartsOn: startDay as 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  return (
    <div class="grid grid-cols-7 grow">
      <For each={weekDays()}>
        {(day) => {
          const features = props.features.filter((f) => isSameDay(f.startAt, day));

          return (
            <div class="border p-2 flex flex-col gap-1">
              <div class="text-xs font-medium">{day.getDate()}</div>

              <For each={features}>{(feature) => props.children?.({ feature })}</For>
            </div>
          );
        }}
      </For>
    </div>
  );
}

function CalendarDayView(props: Readonly<CalendarBodyProps>) {
  const { selectedDate } = useCalendarContext();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayFeatures = createMemo(() =>
    props.features.filter((f) => isSameDay(f.startAt, selectedDate())),
  );

  return (
    <div class="flex flex-col">
      <For each={hours}>
        {(hour) => {
          const features = dayFeatures().filter((f) => f.startAt.getHours() === hour);

          return (
            <div class="flex border-t min-h-[60px]">
              <div class="w-16 text-xs text-muted-foreground p-2">{hour}:00</div>

              <div class="flex-1 p-2 flex flex-col gap-1">
                <For each={features}>{(feature) => props.children?.({ feature })}</For>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

export function CalendarView(props: Readonly<CalendarBodyProps>) {
  const { view } = useCalendarContext();

  return (
    <Show
      when={view() === 'month'}
      fallback={
        <Show when={view() === 'week'} fallback={<CalendarDayView {...props} />}>
          <CalendarWeekView {...props} />
        </Show>
      }
    >
      <CalendarBody {...props} />
    </Show>
  );
}
