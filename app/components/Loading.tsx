import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <Loader className="h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we fetch the data.</p>
        </div>
      </div>
    </div>
  );
}
