import { useCurrentUser } from '~/hooks/useCurrentUser';

export default function SuperadminDashboard() {
  const userContext = useCurrentUser();

  return (
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-8">
      <div class="flex flex-col items-center gap-4">
        <img src="/gramedia.webp" alt="Gramedia Logo" class="h-24 w-24 rounded-xl shadow-lg" />
        <h1 class="text-4xl font-bold text-primary">MARS</h1>
        <p class="text-lg text-muted-foreground">Meeting Area Reservation System</p>
      </div>

      <div class="flex flex-col items-center gap-2 text-center">
        <h2 class="text-2xl font-semibold">Welcome, {userContext.currentUser?.name}!</h2>
        <p class="text-muted-foreground">You are logged in as Superadmin</p>
      </div>

      <div class="text-sm text-muted-foreground mt-4">
        <p>Version 0.1 • Gramedia Meeting Room System</p>
      </div>
    </div>
  );
}
