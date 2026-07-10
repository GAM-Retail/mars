import { Outlet, redirect } from 'react-router';
import { getUserSession } from '~/lib/auth.server';

export async function loader({ request }: { request: Request }) {
  const user = await getUserSession(request);
  if (user) {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      throw redirect('/dashboard');
    }
  }
  return null;
}

export default function AuthLayout() {
  return <Outlet />;
}
