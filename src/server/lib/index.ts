import { getSession } from '~/lib/auth.server';

export const validateSession = async (): Promise<string> => {
  const session = await getSession();
  const userId = session.data.userId;

  if (!userId) throw new Error('Unauthorized');

  return userId;
};
