import { Outlet, useLoaderData, redirect, useLocation } from 'react-router';
import { getUserSession } from '~/lib/auth.server';
import CurrentUserProvider from '~/components/CurrentUserProvider';
import { SidebarProvider, SidebarRail, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/AppSidebar';
import { Separator } from '~/components/ui/separator';
import { Toaster } from '~/components/ui/sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import Loading from '~/components/Loading';
import { Suspense } from 'react';

export async function loader({ request }: { request: Request }) {
  const user = await getUserSession(request);
  if (!user) throw redirect('/login');
  return { user };
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((_, i) => ({
    href: '/' + segments.slice(0, i + 1).join('/'),
    label: segments[i].slice(0, 17).concat(segments[i].length > 17 ? '...' : ''),
  }));
}

export default function ProtectedLayout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <>
      <Toaster />
      <CurrentUserProvider currentUser={user}>
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <SidebarRail />
            <div className="flex items-center justify-between border-b py-2 px-2">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4 mr-2" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((bc, index) => (
                      <span key={bc.href} className="flex items-center gap-2">
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          <BreadcrumbLink href={bc.href}>{bc.label}</BreadcrumbLink>
                        </BreadcrumbItem>
                      </span>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </SidebarProvider>
      </CurrentUserProvider>
    </>
  );
}
