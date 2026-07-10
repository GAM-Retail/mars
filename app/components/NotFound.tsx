import { Link } from 'react-router';
import { Button } from '~/components/ui/button';

export default function NotFound({ label, href }: Readonly<{ label?: string; href?: string }>) {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md w-full space-y-6">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
        <p className="text-muted-foreground">
          Sorry, the page you&#39;re looking for doesn&#39;t exist or has been moved.
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
