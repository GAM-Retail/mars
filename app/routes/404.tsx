import { ErrorSection } from '~/components/ErrorSection';
import { Route } from './+types/404';

export default function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <ErrorSection
      error={error}
      initialState={{
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist.',
        code: 404,
        label: 'Go Home',
        href: '/dashboard',
      }}
      allowRewrite={false}
    />
  );
}
