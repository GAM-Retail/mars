import { createSignal, Show } from 'solid-js';
import { Button } from '~/components/ui/button';
import { useNavigate } from '@solidjs/router';
import { ServerCrash } from 'lucide-solid';

type AppCrashProps = {
  error: unknown;
};

export default function AppCrash(props: Readonly<AppCrashProps>) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = createSignal(false);

  const message = () => {
    if (props.error instanceof Error) return props.error.message;
    return 'An unexpected error occurred.';
  };

  const stack = () => {
    if (props.error instanceof Error) return props.error.stack;
    return undefined;
  };

  const handleReload = () => {
    globalThis.location.reload();
  };

  return (
    <div class="min-h-screen bg-background flex items-center justify-center px-6">
      <div class="w-full max-w-3xl rounded-xl border bg-card shadow-sm">
        <div class="flex items-start gap-4 border-b p-6">
          <div class="mt-1">
            <ServerCrash class="h-6 w-6 text-muted-foreground" />
          </div>
          <div class="space-y-1">
            <h1 class="text-lg font-semibold text-foreground">Something went wrong</h1>
            <p class="text-sm text-muted-foreground">
              We couldn’t complete your request. You can try again or return to a safe page.
            </p>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="text-sm text-foreground">{message()}</div>
          <div class="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleReload}>
              Retry
            </Button>

            <Button size="sm" variant="outline" onClick={() => navigate('/')}>
              Go to home
            </Button>

            <Button size="sm" variant="ghost" onClick={() => setShowDetails((v) => !v)}>
              {showDetails() ? 'Hide technical details' : 'Show technical details'}
            </Button>
          </div>
          <Show when={showDetails()}>
            <div class="border-t pt-4">
              <div class="text-xs text-muted-foreground mb-2">Technical details</div>

              <div class="rounded-md bg-muted p-3 text-xs overflow-auto max-h-64">
                <pre class="whitespace-pre-wrap wrap-break-word">{stack() || message()}</pre>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
