import { RouteDefinition, A } from '@solidjs/router';
import { UserRole } from '~/types';
import { Button } from '~/components/ui/button';
import { LoaderCircle, ArrowRight } from 'lucide-solid';

export const route = {
  info: {
    title: 'Home',
    description: 'Home page',
    role: [UserRole.SUPERADMIN, UserRole.ADMIN],
    breadcrumb: {
      href: '/',
      label: 'Home',
    },
  },
} satisfies RouteDefinition;

export default function Home() {
  return (
    <div class="flex h-full w-full items-center justify-center">
      <div class="flex flex-col items-center gap-4 text-center">
        <LoaderCircle class="size-8 animate-spin text-primary" />
        <div class="space-y-1">
          <h2 class="text-xl font-semibold">Redirecting you to Dashboard...</h2>
          <p class="text-sm text-muted-foreground">
            Please wait while we take you to your dashboard.
          </p>
        </div>
        <A href="/dashboard">
          <Button variant="outline" class="mt-2 gap-2">
            Go to Dashboard
            <ArrowRight class="size-4" />
          </Button>
        </A>
      </div>
    </div>
  );
}
