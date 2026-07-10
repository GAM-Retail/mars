import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';

type Item = {
  id: string;
  name: string;
};

type SearchableSheetProps<T extends Item> = {
  title: string;
  description: string;
  searchPlaceholder: string;
  availableItems: T[];
  selectedItems: T[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function SearchableSheet<T extends Item>({
  title,
  description,
  searchPlaceholder,
  availableItems,
  selectedItems,
  onAdd,
  onRemove,
}: Readonly<SearchableSheetProps<T>>) {
  const [open, setOpen] = useState(false);
  const selectedIds = new Set(selectedItems.map((item) => item.id));
  const items = availableItems.filter((item) => !selectedIds.has(item.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <Command className="mt-4 max-h-[80vh] overflow-y-auto">
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        onAdd(item.id);
                      }}
                    >
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary border"
            >
              {item.name}
              <button className="hover:text-destructive" onClick={() => onRemove(item.id)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    </div>
  );
}
