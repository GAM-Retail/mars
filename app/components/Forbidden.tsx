import { Link } from 'react-router';
import { Button } from '~/components/ui/button';

export default function Forbidden({ label, href }: Readonly<{ label?: string; href?: string }>) {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md w-full space-y-6">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">403</h1>
        <h2 className="text-2xl font-semibold text-foreground">Access Forbidden</h2>
        <p className="text-muted-foreground">
          Sorry, you don&#39;t have permission to access this page.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link to="/">
            <Button variant="default">Go Home</Button>
          </Link>
          {label && href && (
            <Link to={href}>
              <Button variant="outline">{label}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
