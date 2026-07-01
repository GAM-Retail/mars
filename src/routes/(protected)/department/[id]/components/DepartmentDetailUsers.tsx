import { A } from '@solidjs/router';
import { For } from 'solid-js';
import { CircleUser } from 'lucide-solid';

type UserItem = {
  id: string;
  nik: string;
  name: string;
  email: string;
};

type Props = {
  users: UserItem[];
};

export default function DepartmentDetailUsers(props: Readonly<Props>) {
  return (
    <div>
      <p class="text-xs text-muted-foreground mb-2">Users</p>
      {props.users.length === 0 ? (
        <p class="text-sm text-muted-foreground">No users are assigned to this department</p>
      ) : (
        <div class="relative">
          <div class="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
            <For each={props.users}>
              {(user) => (
                <A
                  href={`/user/${user.id}`}
                  class="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors"
                >
                  <CircleUser class="h-4 w-4 text-muted-foreground shrink-0" />
                  <div class="flex flex-col min-w-0">
                    <span class="text-sm font-medium truncate">{user.name}</span>
                    <span class="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </A>
              )}
            </For>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
