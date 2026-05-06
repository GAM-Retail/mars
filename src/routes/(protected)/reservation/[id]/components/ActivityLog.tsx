import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { createSignal, For, Show } from 'solid-js';
import { ChevronDown, ChevronUp, FileText, History } from 'lucide-solid';
import { RoomReservationLog } from '~/generated/prisma/client';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Button } from '~/components/ui/button';
import { isValid } from 'date-fns';

export default function ActivityLog(props: Readonly<{ logs: RoomReservationLog[] }>) {
  const [activityOpen, setActivityOpen] = createSignal(false);

  const formatUpdateChanges = (changes: unknown) => {
    if (isValid(new Date(changes as string))) {
      return new Date(changes as string).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return String(changes);
  };
  return (
    <Collapsible
      open={activityOpen()}
      onOpenChange={setActivityOpen}
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <CollapsibleTrigger class="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
        <div class="flex items-center gap-2">
          <History class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Activity</span>
          <span class="text-xs text-muted-foreground">({props.logs?.length || 0})</span>
        </div>
        {activityOpen() ? (
          <ChevronUp class="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown class="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent class="px-4 pb-4">
        <div class="space-y-1">
          <For
            each={props.logs}
            fallback={<p class="text-sm text-muted-foreground text-center py-4">No activity yet</p>}
          >
            {(log) => (
              <div class="flex items-center gap-2 py-1.5 text-sm hover:bg-muted/50 rounded px-2 -mx-2">
                <span class="text-xs text-muted-foreground shrink-0 w-24">
                  {log.createdAt.toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span class="shrink-0">
                  <span
                    class={cn(
                      'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium',
                      log.action === 'CREATE' &&
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                      log.action === 'UPDATE' &&
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                      log.action === 'DELETE' &&
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                    )}
                  >
                    {log.action}
                  </span>
                </span>
                <span class="truncate flex gap-2 items-center">
                  <span class="font-medium">{log.performedByName || log.performedBy}</span>
                  <span class="text-muted-foreground flex items-center gap-1">
                    {log.action === 'CREATE' && ' created reservation'}
                    <Show when={log.action === 'UPDATE'}>
                      updated reservation
                      <Show when={log.changes}>
                        <Popover>
                          <PopoverTrigger
                            as={Button}
                            variant="ghost"
                            size="xs"
                            class="flex items-center text-xs"
                          >
                            <FileText class="h-3 w-3" />
                            changes
                          </PopoverTrigger>
                          <PopoverContent class="w-80">
                            <div class="space-y-2 text-xs">
                              <p class="font-medium text-sm border-b pb-2 mb-2">Changes</p>
                              <Show
                                when={
                                  (log.changes as { before?: Record<string, unknown> })?.before &&
                                  (log.changes as { after?: Record<string, unknown> })?.after
                                }
                              >
                                <For
                                  each={Object.entries(
                                    (log.changes as { after: Record<string, unknown> }).after,
                                  )}
                                >
                                  {([key, afterValue]) => {
                                    const beforeValue = (
                                      log.changes as { before: Record<string, unknown> }
                                    ).before[key];
                                    return (
                                      <Show when={beforeValue !== afterValue}>
                                        <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                                          <span class="text-muted-foreground capitalize">
                                            {key}:
                                          </span>
                                          <span>
                                            <span
                                              class={
                                                beforeValue === afterValue
                                                  ? ''
                                                  : 'line-through text-muted-foreground mr-1'
                                              }
                                            >
                                              {formatUpdateChanges(beforeValue)}
                                            </span>
                                            <Show when={beforeValue !== afterValue}>
                                              <span class="mx-1">→</span>
                                              <span class="font-medium">
                                                {formatUpdateChanges(afterValue)}
                                              </span>
                                            </Show>
                                          </span>
                                        </div>
                                      </Show>
                                    );
                                  }}
                                </For>
                              </Show>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </Show>
                    </Show>
                    {log.action === 'DELETE' && ' deleted reservation'}
                  </span>
                </span>
              </div>
            )}
          </For>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
