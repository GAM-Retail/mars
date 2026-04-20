import { query } from '@solidjs/router';
import { getSession } from '~/lib/auth.server';
import { getAllUsers as getAllUsersRepository } from '~/server/repository/user.server';

export const getAllUsers = query(async () => {
  'use server';

  const session = await getSession();
  const userId = session.data.userId;

  if (!userId) throw new Error('Unauthorized');

  const users = await getAllUsersRepository();

  return {
    status: 'success',
    data: users,
  };
}, 'getAllUsers');
