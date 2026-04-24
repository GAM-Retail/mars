import { action, query, redirect } from '@solidjs/router';
import db from './db';
import {
  getSession,
  login,
  logout as logoutSession,
  validatePassword,
  validateNikOrEmail,
} from './auth.server';
import { CurrentUser } from '~/types';

export const getUser = query(async () => {
  'use server';
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error('User not found');
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return {
      id: user.id,
      email: user.email,
      nik: user.nik,
      name: user.name,
      role: user.role,
    } as CurrentUser;
  } catch {
    await logoutSession();
    return null;
  }
}, 'user');

export const loginAction = action(async (formData: FormData) => {
  'use server';
  const nikOrEmail = String(formData.get('nikOrEmail'));
  const validNikOrEmail = validateNikOrEmail(nikOrEmail);
  const password = String(formData.get('password'));
  const error = validNikOrEmail?.message || validatePassword(password);
  if (error) return new Error(error);
  if (!validNikOrEmail.type) return new Error('NIK or Email is invalid');

  try {
    const user = await login(nikOrEmail, password, validNikOrEmail.type);
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  return redirect('/');
});

export const logout = action(async () => {
  'use server';
  await logoutSession();
  return redirect('/login');
});
