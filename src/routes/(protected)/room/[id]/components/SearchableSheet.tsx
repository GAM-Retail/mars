import { For, JSX, Show } from 'solid-js';
import { Plus, X } from 'lucide-solid';
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

type Props<T extends Item> = {
  title: string;
  description: string;
  searchPlaceholder: string;
  availableItems: T[];
  selectedItems: T[];
  onAdd: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  renderSelectedItem?: (item: T, onRemove: () => void) => JSX.Element;
};

export default function SearchableSheet<T extends Item>(props: Readonly<Props<T>>) {
  const availableItems = () => {
    const selectedIds = new Set(props.selectedItems.map((item) => item.id));
    return props.availableItems.filter((item) => !selectedIds.has(item.id));
  };

  const onAdd = (id: string) => {
    props.onAdd(id);
  };

  const handleRemove = (id: string) => {
    props.onRemove(id);
  };

  const defaultRenderSelectedItem = (item: T, onRemoveHandler: () => void) => (
    <span class="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary border">
      {item.name}
      <button class="hover:text-destructive" onClick={onRemoveHandler}>
        <X class="h-3 w-3" />
      </button>
    </span>
  );
  return (
    <div>
      <div class="flex items-center justify-between mb-2">
        <Sheet>
          <SheetTrigger as={Button} variant="outline" size="sm" class="h-6 text-xs">
            <Plus class="h-3 w-3 mr-1" />
            Add
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{props.title}</SheetTitle>
              <SheetDescription>{props.description}</SheetDescription>
            </SheetHeader>
            <Command class="mt-4 max-h-[80vh]! overflow-y-auto">
              <CommandInput placeholder={props.searchPlaceholder} />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  <For each={availableItems()}>
                    {(item) => (
                      <CommandItem onSelect={() => onAdd(item.id)}>{item.name}</CommandItem>
                    )}
                  </For>
                </CommandGroup>
              </CommandList>
            </Command>
          </SheetContent>
        </Sheet>
      </div>
      <div class="flex flex-wrap gap-2">
        <Show
          when={props.selectedItems.length > 0}
          fallback={<span class="text-sm text-muted-foreground">-</span>}
        >
          <For each={props.selectedItems}>
            {(item) => {
              const render = props.renderSelectedItem ?? defaultRenderSelectedItem;
              // eslint-disable-next-line solid/reactivity
              return render(item, () => handleRemove(item.id));
            }}
          </For>
        </Show>
      </div>
    </div>
  );
}
