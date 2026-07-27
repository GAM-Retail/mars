import { data, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import type { Route } from './+types/root';

import { ThemeProvider } from '~/components/ThemeProvider';
import './app.css';
import { Toaster } from '~/components/ui/sonner';
import { TooltipProvider } from '~/components/ui/tooltip';
import { ErrorSection } from '~/components/ErrorSection';
import { commitSession, getSession } from '~/lib/session.server';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const toast = session.get('toast');
  return data(
    { toast },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
};
export function Layout(props: Readonly<{ children: React.ReactNode }>) {
  const { toast: flashToast } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (!flashToast) return;

    toast[flashToast.type](flashToast.title, {
      id: flashToast.id,
      description: flashToast.description,
    });
  }, [flashToast]);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            {props.children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <ThemeProvider>
      <ErrorSection error={error} />
    </ThemeProvider>
  );
}

export default function Root() {
  return <Outlet />;
}
