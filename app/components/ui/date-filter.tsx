import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { TextField, TextFieldInput, TextFieldLabel } from '~/components/ui/text-field';
import { Calendar, X, ArrowLeftRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface DateFilterProps {
  columnId: string;
  onFilterChange: (filter: { from?: string; to?: string } | undefined) => void;
}

export function DateFilter({ columnId: _columnId, onFilterChange }: DateFilterProps) {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleApply = () => {
    if (from || to) {
      onFilterChange({
        from: from || undefined,
        to: to || undefined,
      });
    } else {
      onFilterChange(undefined);
    }
    setOpen(false);
  };

  const clearFilter = () => {
    setFrom('');
    setTo('');
    onFilterChange(undefined);
  };

  const hasFilter = !!from || !!to;
  const label =
    !from && !to ? 'Date' : from && to ? `${from} - ${to}` : from ? `From ${from}` : `Until ${to}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">{label}</span>
          <span className="text-sm sm:hidden">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-70 max-w-[90vw] p-0 overflow-hidden" align="start">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-medium">Filter by date</span>
            <Button variant="ghost" size="sm" onClick={clearFilter} disabled={!hasFilter}>
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          <div className="flex items-end gap-2 p-4">
            <TextField name="from" value={from} onChange={(v) => setFrom(v)}>
              <TextFieldLabel className="text-xs">From</TextFieldLabel>
              <div className="relative">
                <TextFieldInput
                  type="date"
                  max={to || undefined}
                  className="pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    input?.showPicker();
                  }}
                >
                  <Calendar className="h-3 w-3" />
                </button>
              </div>
            </TextField>

            <span className="text-muted-foreground pb-2">→</span>

            <TextField name="to" value={to} onChange={(v) => setTo(v)}>
              <TextFieldLabel className="text-xs">To</TextFieldLabel>
              <div className="relative">
                <TextFieldInput
                  type="date"
                  min={from || undefined}
                  className="pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    input?.showPicker();
                  }}
                >
                  <Calendar className="h-3 w-3" />
                </button>
              </div>
            </TextField>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-3 bg-muted/20">
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
