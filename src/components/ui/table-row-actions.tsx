import type { Row } from '@tanstack/solid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Ellipsis } from 'lucide-solid';
import { useNavigate } from '@solidjs/router';

type TableRowActionsProps<TData> = {
  row: Row<TData>;
  detailUrl?: string;
  paramName?: string;
};

export function TableRowActions<TData>(props: Readonly<TableRowActionsProps<TData>>) {
  const navigate = useNavigate();
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button<'button'>}
        variant="ghost"
        class="flex size-8 p-0 data-[state=open]:bg-muted"
        aria-label="Open menu"
      >
        <Ellipsis />
        <span class="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-40">
        <DropdownMenuItem
          as={Button}
          class="w-full hover:bg-transparent! hover:text-foreground! justify-start"
          size="sm"
          variant="ghost"
          onSelect={() => navigate(props.row.getValue(props?.paramName ?? 'id'))}
        >
          Detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
