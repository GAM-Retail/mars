import { createSignal } from 'solid-js';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { TextField, TextFieldInput, TextFieldLabel } from '~/components/ui/text-field';
import { Calendar, X, ArrowLeftRight } from 'lucide-solid';
import { Button } from '~/components/ui/button';

interface DateFilterProps {
  columnId: string;
  onFilterChange: (filter: { from?: string; to?: string } | undefined) => void;
}

export function DateFilter(props: Readonly<DateFilterProps>) {
  const [from, setFrom] = createSignal('');
  const [to, setTo] = createSignal('');
  const [open, setOpen] = createSignal(false);

  const handleApply = () => {
    if (from() || to()) {
      props.onFilterChange({
        from: from() || undefined,
        to: to() || undefined,
      });
    } else {
      props.onFilterChange(undefined);
    }
    setOpen(false);
  };

  const clearFilter = () => {
    setFrom('');
    setTo('');
    props.onFilterChange(undefined);
  };

  const hasFilter = () => !!from() || !!to();
  const label = () => {
    if (!from() && !to()) return 'Date';
    if (from() && to()) return `${from()} - ${to()}`;
    if (from()) return `From ${from()}`;
    return `Until ${to()}`;
  };

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger as={Button<'button'>} variant="outline" size="sm" class="gap-2">
        <ArrowLeftRight class="h-4 w-4" />
        <span class="text-sm hidden sm:inline">{label()}</span>
        <span class="text-sm sm:hidden">Filter</span>
      </PopoverTrigger>
      <PopoverContent class="w-auto min-w-70 max-w-[90vw] p-0 overflow-hidden">
        <div class="flex flex-col">
          <div class="flex items-center justify-between border-b px-4 py-3">
            <span class="text-sm font-medium">Filter by date</span>
            <Button variant="ghost" size="sm" onClick={clearFilter} disabled={!hasFilter()}>
              <X class="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          <div class="flex items-end gap-2 p-4">
            <TextField class="flex-1">
              <TextFieldLabel class="text-xs">From</TextFieldLabel>
              <div class="relative">
                <TextFieldInput
                  type="date"
                  value={from()}
                  max={to() || undefined}
                  onInput={(e) => setFrom(e.currentTarget.value)}
                  class="pr-8"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    input?.showPicker();
                  }}
                >
                  <Calendar class="h-3 w-3" />
                </button>
              </div>
            </TextField>

            <span class="text-muted-foreground pb-2">→</span>

            <TextField class="flex-1">
              <TextFieldLabel class="text-xs">To</TextFieldLabel>
              <div class="relative">
                <TextFieldInput
                  type="date"
                  value={to()}
                  min={from() || undefined}
                  onInput={(e) => setTo(e.currentTarget.value)}
                  class="pr-8"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    input?.showPicker();
                  }}
                >
                  <Calendar class="h-3 w-3" />
                </button>
              </div>
            </TextField>
          </div>

          <div class="flex justify-end gap-2 border-t px-4 py-3 bg-muted/20">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
