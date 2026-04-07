import { useSubmission, type RouteSectionProps } from '@solidjs/router';
import { Show } from 'solid-js';
import { loginAction } from '~/lib';
import { Button } from '~/components/ui/button';
import { TextField, TextFieldInput, TextFieldLabel } from '~/components/ui/text-field';
import { ModeToggle } from '~/components/ModeToggle';

export default function Login(props: Readonly<RouteSectionProps>) {
  const loggingIn = useSubmission(loginAction);
  return (
    <main class="w-full h-screen flex">
      <div class="relative flex flex-1 items-center justify-center px-6 bg-muted/40 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div
          class="absolute inset-0 opacity-[0.03]"
          style={{
            'background-image': `
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px)
      `,
            'background-size': '56px 56px',
          }}
        />
        <div class="absolute top-4 left-4 z-10">
          <ModeToggle />
        </div>
        <div class="relative w-full max-w-sm rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl p-6 shadow-2xl">
          <div class="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
          <div class="relative z-10 flex flex-col gap-2 mb-6 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p class="text-sm text-muted-foreground">Login to your meeting reservation</p>
          </div>
          <form action={loginAction} method="post" class="relative z-10 flex flex-col gap-4">
            <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? '/'} />
            <TextField name="nikOrEmail">
              <TextFieldLabel>NIK atau Email</TextFieldLabel>
              <TextFieldInput placeholder="e.g. 123456 / email@company.com" />
            </TextField>
            <TextField name="password">
              <TextFieldLabel>Password</TextFieldLabel>
              <TextFieldInput type="password" placeholder="*******" />
            </TextField>
            <Button
              type="submit"
              class="mt-2 w-full transition-all duration-200"
              disabled={loggingIn.pending}
            >
              {loggingIn.pending ? 'Logging in...' : 'Login'}
            </Button>
            <Show when={loggingIn.result}>
              <p class="text-sm text-destructive" role="alert">
                {loggingIn.result!.message}
              </p>
            </Show>
          </form>
        </div>
      </div>
      <div class="hidden md:flex flex-[0.8] relative items-center justify-center bg-linear-to-br from-primary via-primary/80 to-primary/30 text-white">
        <div class="absolute inset-0 bg-black/20" />
        <div
          class="absolute inset-0 opacity-25"
          style={{
            'background-image': `
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px)
      `,
            'background-size': '56px 56px',
          }}
        />
        <div class="relative z-10 flex flex-col items-center gap-4 text-center px-6">
          <img src="/gramedia.webp" class="w-24" alt="Gramedia Logo" />
          <h2 class="text-xl font-semibold">Meeting Area Reservation System</h2>
          <p class="text-sm text-white/80 max-w-xs">
            Book and manage your meeting rooms efficiently in one place.
          </p>
          <Button variant="secondary" class="mt-4 w-full flex items-center justify-center gap-2">
            📅 Check calendar
          </Button>
        </div>
        <div class="absolute text-sm text-foreground dark:text-muted-foreground bottom-2 w-full text-center">
          &copy; {new Date().getFullYear()} Kompas Gramedia, System Information & Technology
          Division.
        </div>
      </div>
    </main>
  );
}
