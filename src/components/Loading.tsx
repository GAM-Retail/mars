import { Loader } from 'lucide-solid';

export default function Loading() {
  return (
    <div class="min-h-[90vh] flex items-center justify-center bg-background px-4">
      <div class="flex flex-col items-center gap-6 text-center">
        <div class="relative">
          <Loader class="h-12 w-12 animate-spin text-primary" />
        </div>

        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-foreground">Loading...</h2>
          <p class="text-sm text-muted-foreground">Please wait while we fetch the data.</p>
        </div>
      </div>
    </div>
  );
}
