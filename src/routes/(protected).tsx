import { createAsync, RouteSectionProps, useNavigate } from '@solidjs/router';
import { getUser } from '~/lib';
import CurrentUserProvider from '~/components/CurrentUserProvider';
import { createEffect, Show } from 'solid-js';
import { SidebarProvider, SidebarRail, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/AppSidebar';

export default function Protected(props: Readonly<RouteSectionProps>) {
  const user = createAsync(() => getUser(), { deferStream: true });

  const navigate = useNavigate();
  createEffect(() => {
    if (!user()) {
      navigate('/login', { replace: true });
    }
  });
  return (
    <main class="w-full">
      <Show when={user()}>
        {/* @ts-expect-error null and/or undefined check is already done in the createEffect and Show Component */}
        <CurrentUserProvider currentUser={user()}>
          <SidebarProvider>
            <AppSidebar />
            <div class="w-full">
              <SidebarRail />
              <SidebarTrigger />
              {props.children}
            </div>
          </SidebarProvider>
        </CurrentUserProvider>
      </Show>
    </main>
  );
}
