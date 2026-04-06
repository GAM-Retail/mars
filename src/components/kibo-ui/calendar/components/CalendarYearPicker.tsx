import { createMemo, JSX } from 'solid-js';
import { useCalendarYear } from '~/components/kibo-ui/calendar/hooks/useCalendarYear';
import { cn } from '~/lib/utils';

import { Select as KobalteSelect } from '@kobalte/core/select';

type YearSelectProps = {
  class?: string;
  start: number;
  end: number;
};

export function CalendarYearPicker(props: Readonly<YearSelectProps>): JSX.Element {
  const [year, setYear] = useCalendarYear();

  const yearData = createMemo(() => {
    const start = props.start;
    const end = props.end;
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => ({
      value: (start + i).toString(),
      label: (start + i).toString(),
    }));
  });

  return (
    <KobalteSelect
      value={year().toString()}
      onChange={(value) => value && setYear(Number.parseInt(value, 10))}
      options={yearData().map((y) => y.value)}
      placeholder="Select year"
      itemComponent={(itemProps) => (
        <KobalteSelect.Item
          item={itemProps.item}
          class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-muted data-highlighted:bg-muted"
        >
          <KobalteSelect.ItemLabel>
            {yearData().find((y) => y.value === itemProps.item.rawValue)?.label}
          </KobalteSelect.ItemLabel>
        </KobalteSelect.Item>
      )}
    >
      <KobalteSelect.Trigger
        class={cn(
          'inline-flex items-center justify-between w-24 rounded-md border border-input px-3 py-2 text-sm gap-2',
          props.class,
        )}
      >
        <KobalteSelect.Value<string>>
          {(state) => state.selectedOption() || 'Year'}
        </KobalteSelect.Value>
        <KobalteSelect.Icon>
          <svg
            class="h-4 w-4 opacity-50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </KobalteSelect.Icon>
      </KobalteSelect.Trigger>
      <KobalteSelect.Portal>
        <KobalteSelect.Content class="z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 shadow-md data-expanded:animate-in data-expanded:fade-in data-closed:animate-out data-closed:fade-out">
          <KobalteSelect.Listbox class="max-h-60 overflow-auto p-1" />
        </KobalteSelect.Content>
      </KobalteSelect.Portal>
    </KobalteSelect>
  );
}
