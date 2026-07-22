import { Outlet, useLoaderData, redirect, useLocation, data } from 'react-router';
import { getUserSession } from '~/lib/auth.server';
import CurrentUserProvider from '~/components/CurrentUserProvider';
import { SidebarProvider, SidebarRail, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/AppSidebar';
import { Separator } from '~/components/ui/separator';
import { Toaster } from '~/components/ui/sonner';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import Loading from '~/components/Loading';
import { Suspense, useEffect } from 'react';
import { ErrorSection } from '~/components/ErrorSection';
import { Route } from './+types/protected';
import { commitSession, getSession } from '~/lib/session.server';

export async function loader({ request }: { request: Request }) {
  const user = await getUserSession(request);
  if (!user) throw redirect('/login');
  const session = await getSession(request.headers.get('Cookie'));
  const toast = session.get('toast');
  return data(
    { user, toast },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((_, i) => ({
    href: '/' + segments.slice(0, i + 1).join('/'),
    label: segments[i].slice(0, 17).concat(segments[i].length > 17 ? '...' : ''),
  }));
}

export default function ProtectedLayout({ children }: Readonly<{ children?: React.ReactNode }>) {
  const { user, toast: flashToast } = useLoaderData<typeof loader>();
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  useEffect(() => {
    if (!flashToast) return;

    toast[flashToast.type](flashToast.title, {
      id: flashToast.id,
      description: flashToast.description,
    });
  }, [flashToast]);

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
            <Suspense fallback={<Loading />}>{children || <Outlet />}</Suspense>
          </div>
        </SidebarProvider>
      </CurrentUserProvider>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorSection authorized error={error} />;
}
