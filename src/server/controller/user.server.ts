import { action, json, query } from '@solidjs/router';
import db from '~/lib/db';
import {
  createUser,
  deleteUser,
  getAllUsers as getAllUsersRepository,
  getUserById,
  updateUser,
} from '~/server/repository/user.server';
import { validateSessionWithRole } from '~/server/lib';
import { UserRole } from '~/generated/prisma/enums';
import { NotFoundError } from '~/lib/error';

export const getAllUsers = query(async () => {
  'use server';
  await validateSessionWithRole('SUPERADMIN');

  return await getAllUsersRepository();
}, 'getAllUsers');

export const getUserByIdController = query(async (id: string) => {
  'use server';
  await validateSessionWithRole('SUPERADMIN');

  if (!id) {
    throw new Error('Id is required');
  }

  const user = await getUserById(id);

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  return { user };
}, 'getUserById');

export const createUserAction = action(
  async (values: {
    nik: string;
    email: string;
    name: string;
    password: string;
    role: UserRole;
  }) => {
    'use server';
    await validateSessionWithRole('SUPERADMIN');

    const existingNik = await db.user.findUnique({ where: { nik: values.nik } });
    if (existingNik) {
      throw new Error('NIK already exists');
    }

    const existingEmail = await db.user.findUnique({ where: { email: values.email } });
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const newUser = await createUser(values);

    return { user: newUser };
  },
);

export const updateUserAction = action(
  async (values: {
    id: string;
    nik: string;
    email: string;
    name: string;
    role: UserRole;
    password?: string;
  }) => {
    'use server';
    await validateSessionWithRole('SUPERADMIN');

    const existingUser = await getUserById(values.id);
    if (!existingUser) {
      throw new NotFoundError('User does not exist');
    }

    const existingNik = await db.user.findUnique({
      where: { nik: values.nik, NOT: { id: values.id } },
    });
    if (existingNik) {
      throw new Error('NIK already exists');
    }

    const existingEmail = await db.user.findUnique({
      where: { email: values.email, NOT: { id: values.id } },
    });
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const updatedUser = await updateUser({
      id: values.id,
      nik: values.nik,
      email: values.email,
      name: values.name,
      role: values.role,
      password: values.password,
    });

    return { user: updatedUser };
  },
);

export const deleteUserAction = action(async (id: string) => {
  'use server';
  await validateSessionWithRole('SUPERADMIN');

  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new NotFoundError('User does not exist');
  }

  await deleteUser(id);

  return json({ success: true }, { revalidate: [] });
});
