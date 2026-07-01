import { For } from 'solid-js';
import { Contact } from 'lucide-solid';

type OrganizerItem = {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
};

type Props = {
  organizers: OrganizerItem[];
};

export default function DivisionDetailOrganizers(props: Readonly<Props>) {
  return (
    <div>
      <p class="text-xs text-muted-foreground mb-2">Organizers</p>
      {props.organizers.length === 0 ? (
        <p class="text-sm text-muted-foreground">No organizers are assigned to this division</p>
      ) : (
        <div class="relative">
          <div class="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
            <For each={props.organizers}>
              {(organizer) => (
                <div class="flex items-center gap-2 p-2 rounded-md border">
                  <Contact class="h-4 w-4 text-muted-foreground shrink-0" />
                  <div class="flex flex-col min-w-0">
                    <span class="text-sm font-medium truncate">{organizer.name}</span>
                    <span class="text-xs text-muted-foreground truncate">{organizer.email}</span>
                  </div>
                </div>
              )}
            </For>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
