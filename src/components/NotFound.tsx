import { A } from '@solidjs/router';
import { Button } from '~/components/ui/button';
import { Show } from 'solid-js';

export default function NotFound(props: Readonly<{ label?: string; href?: string }>) {
  return (
    <div class="min-h-[90vh] flex items-center justify-center bg-background px-4">
      <div class="text-center max-w-md w-full space-y-6">
        <h1 class="text-6xl font-bold tracking-tight text-foreground">404</h1>
        <h2 class="text-2xl font-semibold text-foreground">Page not found</h2>
        <p class="text-muted-foreground">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <div class="flex justify-center gap-3 pt-4">
          <Button as={A} href="/" variant="default">
            Go Home
          </Button>
          <Show when={props.label && props.href}>
            <Button as={A} href={props.href as string} variant="outline">
              {props.label}
            </Button>
          </Show>
        </div>
      </div>
    </div>
  );
}
