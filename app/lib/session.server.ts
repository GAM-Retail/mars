import { createCookieSessionStorage } from 'react-router';
import db from '~/lib/db';
import { UserRole } from '~/generated/prisma/enums';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required');
}

export type ToastFlash = {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
};

type SessionFlashData = {
  toast: ToastFlash;
  error: string;
};

export type SessionData = { userId: string };

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 604800,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.COOKIE_SECURE === 'true',
  },
});

export const validateSession = async (request?: Request): Promise<string> => {
  const session = await getSession(request?.headers.get('Cookie'));
  const userId = session.data.userId;
  if (!userId) throw new Error('Unauthorized');
  return userId;
};

export const validateSessionWithRole = async (
  requiredRole: UserRole | UserRole[],
  request?: Request,
): Promise<string> => {
  const session = await getSession(request?.headers.get('Cookie'));
  const userId = session.data.userId;
  if (!userId) throw new Error('You must be logged in to access this resource');
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  if (!roles.includes(user.role)) throw new Error('You do not have permission');
  return userId;
};

export const dateTimeBuilder = (date: string, time: string) => {
  return new Date(`${date}T${time}:00+07:00`);
};

export { getSession, commitSession, destroySession };
