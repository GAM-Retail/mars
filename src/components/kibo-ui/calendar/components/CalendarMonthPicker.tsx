import { createMemo, JSX } from 'solid-js';
import { Select as KobalteSelect } from '@kobalte/core/select';
import { cn } from '~/lib/utils';
import { useCalendarMonth } from '~/components/kibo-ui/calendar/hooks/useCalendarMonth';
import { useCalendarContext } from '~/components/kibo-ui/calendar/hooks/useCalendarContext';
import { monthsForLocale } from '~/components/kibo-ui/calendar/libs/utils';
import { CalendarState } from '~/components/kibo-ui/calendar/types';

type MonthSelectProps = {
  class?: string;
};

export function CalendarMonthPicker(props: Readonly<MonthSelectProps>): JSX.Element {
  const [month, setMonth] = useCalendarMonth();
  const { locale } = useCalendarContext();

  const monthData = createMemo(() => {
    return monthsForLocale(locale).map((month, index) => ({
      value: index.toString(),
      label: month,
    }));
  });

  return (
    <KobalteSelect
      value={month().toString()}
      onChange={(value) => value && setMonth(Number.parseInt(value, 10) as CalendarState['month'])}
      options={monthData().map((m) => m.value)}
      placeholder="Select month"
      itemComponent={(itemProps) => (
        <KobalteSelect.Item
          item={itemProps.item}
          class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-muted data-highlighted:bg-muted"
        >
          <KobalteSelect.ItemLabel class="capitalize">
            {monthData().find((m) => m.value === itemProps.item.rawValue)?.label}
          </KobalteSelect.ItemLabel>
        </KobalteSelect.Item>
      )}
    >
      <KobalteSelect.Trigger
        class={cn(
          'inline-flex items-center justify-between w-40 rounded-md border border-input px-3 py-2 text-sm gap-2 capitalize',
          props.class,
        )}
      >
        <KobalteSelect.Value<string>>
          {(state) =>
            monthData().find((m) => m.value === state.selectedOption())?.label || 'Select month'
          }
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
