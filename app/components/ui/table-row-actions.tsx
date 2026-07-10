import type { Row } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TableRowActionsProps<TData> {
  row: Row<TData>;
  detailUrl?: string;
  paramName?: string;
}

export function TableRowActions<TData>({ row, detailUrl: _detailUrl, paramName }: TableRowActionsProps<TData>) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
          aria-label="Open menu"
        >
          <Ellipsis />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem
          onSelect={() => navigate(row.getValue(paramName ?? 'id'))}
        >
          Detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
