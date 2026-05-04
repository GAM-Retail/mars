import { action, json, query } from '@solidjs/router';
import db from '~/lib/db';
import {
  checkUserCanBeDeleted,
  createUser,
  deleteUser,
  getAllUsers as getAllUsersRepository,
  getUserById,
  updateUser,
} from '~/server/repository/user.server';
import { validateSession, validateSessionWithRole } from '~/server/lib';
import { UserRole } from '~/generated/prisma/enums';
import { NotFoundError, ForbiddenError } from '~/lib/error';

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
    ext?: string;
    division?: string;
    department?: string;
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
    role?: UserRole;
    password?: string;
    ext?: string;
    division?: string;
    department?: string;
    isProfileUpdate?: boolean;
  }) => {
    'use server';
    const userId = await validateSession();

    const existingUser = await getUserById(values.id);
    if (!existingUser) {
      throw new NotFoundError('User does not exist');
    }

    let currentRole: UserRole;

    if (values.isProfileUpdate) {
      if (values.id !== userId) {
        throw new ForbiddenError('You can only update your own profile');
      }
      currentRole = existingUser.role;
    } else {
      await validateSessionWithRole('SUPERADMIN');
      currentRole = values.role!;
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
      role: currentRole,
      password: values.password,
      ext: values.ext,
      division: values.division,
      department: values.department,
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

  const { hasReservations, isRoomPic } = await checkUserCanBeDeleted(id);

  if (hasReservations) {
    throw new Error(
      'Cannot delete user with active reservations. Please remove reservations first.',
    );
  }

  if (isRoomPic) {
    throw new Error(
      'Cannot delete user who is a person in charge of a room. Please reassign the room first.',
    );
  }

  await deleteUser(id);

  return json({ success: true }, { revalidate: [] });
});

export const changePasswordAction = action(
  async (values: { id: string; currentPassword: string; newPassword: string }) => {
    'use server';
    const userId = await validateSession();

    if (values.id !== userId) {
      throw new ForbiddenError('You can only change your own password');
    }

    const user = await getUserById(values.id, { includeSensitive: true });
    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const { verifyPassword } = await import('~/server/lib/hash.server');
    const isValid = await verifyPassword(values.currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    await updateUser({
      id: values.id,
      nik: user.nik,
      email: user.email,
      name: user.name,
      role: user.role,
      password: values.newPassword,
      ext: user.ext ?? undefined,
      division: user.division ?? undefined,
      department: user.department ?? undefined,
    });

    return { success: true };
  },
);

export const resetPasswordAction = action(async (values: { id: string; newPassword: string }) => {
  'use server';
  await validateSessionWithRole('SUPERADMIN');

  const user = await getUserById(values.id);
  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  await updateUser({
    id: values.id,
    nik: user.nik,
    email: user.email,
    name: user.name,
    role: user.role,
    password: values.newPassword,
    ext: user.ext ?? undefined,
    division: user.division ?? undefined,
    department: user.department ?? undefined,
  });

  return { success: true };
});
