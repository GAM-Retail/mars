import {
  A,
  createAsync,
  RouteSectionProps,
  useCurrentMatches,
  useLocation,
  useNavigate,
} from '@solidjs/router';
import { getUser } from '~/server/controller/session.server';
import CurrentUserProvider from '~/components/CurrentUserProvider';
import { createEffect, createMemo, For, Show, Suspense, ErrorBoundary } from 'solid-js';
import { SidebarProvider, SidebarRail, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/AppSidebar';
import { Meta, Title } from '@solidjs/meta';
import { Separator } from '~/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Toaster } from '~/components/ui/sonner';
import Forbidden from '~/components/Forbidden';
import NotFound from '~/components/NotFound';
import Loading from '~/components/Loading';

export default function Protected(props: Readonly<RouteSectionProps>) {
  const user = createAsync(() => getUser(), { deferStream: true });

  const navigate = useNavigate();
  const location = useLocation();
  createEffect(() => {
    if (!user()) {
      navigate('/login', { replace: true });
    } else if (location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
});
  const matches = useCurrentMatches();
  const title = createMemo(() => matches().at(matches()?.length - 1)?.route?.info?.title);
  const description = createMemo(
    () => matches().at(matches()?.length - 1)?.route?.info?.description,
  );
  const currentPageRole = createMemo(() => matches().at(matches()?.length - 1)?.route?.info?.role);
  const newButtonState = createMemo(
    () => matches().at(matches()?.length - 1)?.route?.info?.newButtonState,
  );
  const firstMatchChildren = (
    matches()?.[0]?.route?.key as {
      children: { info?: { breadcrumb: { href: string; label: string } } }[];
    }
  )?.children;
  // Workaround for known bug on useCurrentMatches()
  // @see https://github.com/solidjs/solid-router/issues/528
  const breadcrumbs = createMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);

    return segments.map((_, i) => {
      const href = '/' + segments.slice(0, i + 1).join('/');

      const match = firstMatchChildren.find((m) => m.info?.breadcrumb?.href === href);

      return (
        match?.info?.breadcrumb ?? {
          href,
          label: segments[i].slice(0, 17).concat(segments[i].length > 17 ? '...' : ''),
        }
      );
    });
  });
  return (
    <>
      <Toaster />
      <Show when={title()} fallback={<Title>MARS</Title>}>
        <Title>{title()} | MARS</Title>
      </Show>
      <Show
        when={description()}
        fallback={<Meta name="description" content="Meeting Area Reservation System" />}
      >
        <Meta name="description" content={description()} />
      </Show>
      <main class="w-full">
        <Show when={user()}>
          {/* @ts-expect-error null and/or undefined check are already done in the createEffect and Show Component */}
          <CurrentUserProvider currentUser={user()}>
            <SidebarProvider>
              <AppSidebar />
              <div class="w-full">
                <SidebarRail />
                <div class="flex items-center justify-between border-b py-2 px-2">
                  <div class="flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator orientation="vertical" class="h-4 mr-2" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <For each={breadcrumbs()}>
                          {(breadcrumb, index) => (
                            <Show when={breadcrumb}>
                              <BreadcrumbItem>
                                <BreadcrumbLink href={breadcrumb?.href}>
                                  {breadcrumb?.label}
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <Show when={index() !== breadcrumbs().length - 1}>
                                <BreadcrumbSeparator />
                              </Show>
                            </Show>
                          )}
                        </For>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                  <Show
                    when={newButtonState() && currentPageRole().includes(user()?.role)}
                    fallback={<></>}
                  >
                    <Button size="sm" as={A} href={newButtonState().href}>
                      {newButtonState().label}
                    </Button>
                  </Show>
                </div>
                <ErrorBoundary
                  fallback={(err) => {
                    if (err instanceof Error && err.name === 'ForbiddenError') {
                      return <Forbidden />;
                    }
                    if (err instanceof Error && err.name === 'NotFoundError') {
                      const currentPageBreadcrumb = breadcrumbs()?.[0];
                      return (
                        <NotFound
                          label={currentPageBreadcrumb.label}
                          href={currentPageBreadcrumb.href}
                        />
                      );
                    }
                    throw err;
                  }}
                >
                  <Suspense fallback={<Loading />}>
                    <Show when={currentPageRole().includes(user()?.role)} fallback={<Forbidden />}>
                      {props.children}
                    </Show>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </SidebarProvider>
          </CurrentUserProvider>
        </Show>
      </main>
    </>
  );
}
