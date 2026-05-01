import { getSession } from '~/server/lib/auth.server';
import db from '~/lib/db';
import { UserRole } from '~/types';
import { ForbiddenError } from '~/lib/error';

export const validateSession = async (): Promise<string> => {
  const session = await getSession();
  const userId = session.data.userId;

  if (!userId) throw new Error('Unauthorized');

  return userId;
};

export const validateSessionWithRole = async (requiredRole: UserRole): Promise<string> => {
  const session = await getSession();
  const userId = session.data.userId;

  if (!userId) throw new ForbiddenError('You must be logged in to access this resource');

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new ForbiddenError('User not found');

  if (user.role !== requiredRole) {
    throw new ForbiddenError();
  }

  return userId;
};

export const dateTimeBuilder = (date: string, time: string) => {
  return new Date(`${date}T${time}:00`);
};
