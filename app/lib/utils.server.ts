import { commitSession, getSession, ToastFlash } from '~/lib/session.server';
import { data, redirect } from 'react-router';

export async function redirectWithToast(
  request: Request,
  to: string,
  toast: Omit<ToastFlash, 'id'>,
) {
  const session = await getSession(request.headers.get('Cookie'));

  session.flash('toast', { ...toast, id: crypto.randomUUID() });

  return redirect(to, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function dataWithToast(
  request: Request,
  value: unknown,
  toast: Omit<ToastFlash, 'id'>,
) {
  const session = await getSession(request.headers.get('Cookie'));

  session.flash('toast', { ...toast, id: crypto.randomUUID() });

  return data(value, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
