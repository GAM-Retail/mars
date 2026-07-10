import { useFetcher, redirect, Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';
import { loginAction } from '~/lib/auth.server';
import { useEffect } from 'react';
import { commitSession, getSession } from '~/lib/session.server';
import { Separator } from '~/components/ui/separator';

export async function action({ request }: { request: Request }) {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const result = await loginAction(formData);
  if (!result.success) {
    return { error: result.error };
  }

  session.set('userId', result.user.id);
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function Login() {
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state !== 'idle';

  const error = fetcher.data?.error;
  useEffect(() => {
    if (error) {
      toast.error('Login failed', { description: error });
    }
  }, [error]);

  return (
    <main className="w-full h-screen flex">
      <div className="relative flex flex-1 items-center justify-center px-6 bg-muted/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl p-6 shadow-2xl">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-2 mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Login to your meeting reservation</p>
          </div>
          <fetcher.Form method="post" className="relative z-10 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium" htmlFor="nikOrEmail">
                NIK atau Email
              </label>
              <input
                id="nikOrEmail"
                name="nikOrEmail"
                placeholder="e.g. 123456 / email@company.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="*******"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </fetcher.Form>
          <Separator className="my-4" />
          <div className="relative z-10 mt-4 text-center">
            <Link to="/calendar">
              <Button variant="outline" className="w-full">
                Go to Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
