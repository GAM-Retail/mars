import db from '~/lib/db';
import { hashPassword, verifyPassword } from '~/lib/hash.server';
import { validateSession, validateSessionWithRole } from '~/lib/session.server';
import { UserRole } from '~/generated/prisma/enums';

import type { CreateUserDTO, UpdateUserDTO } from '~/lib/services/types';

export async function getUserById(id: string, options?: { includeSensitive?: boolean }) {
  const { includeSensitive = false } = options ?? {};
  return db.user.findUnique({
    where: { id },
    ...(!includeSensitive && { omit: { password: true } }),
    include: { department: true, division: true },
  });
}

export async function changeUserPassword(id: string, newPassword: string) {
  const hashed = await hashPassword(newPassword);
  return db.user.update({ data: { password: hashed }, where: { id } });
}

export async function createUser(data: CreateUserDTO) {
  const hashedPassword = await hashPassword(data.password);
  return db.user.create({
    data: {
      nik: data.nik,
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      ext: data.ext,
      divisionId: data.divisionId,
      departmentId: data.departmentId,
    },
  });
}

export async function updateUser(data: UpdateUserDTO) {
  return db.user.update({
    data: {
      nik: data.nik,
      email: data.email,
      name: data.name,
      role: data.role,
      ...(data.password && { password: await hashPassword(data.password) }),
      ext: data.ext,
      divisionId: data.divisionId,
      departmentId: data.departmentId,
    },
    where: { id: data.id },
  });
}

export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } });
}

export async function checkUserCanBeDeleted(id: string) {
  const hasReservations =
    (await db.roomReservation.count({
      where: { reservedById: id, deletedAt: null },
    })) > 0;
  const isRoomPic =
    (await db.roomPersonInCharge.count({
      where: { personInChargeId: id },
    })) > 0;
  return { hasReservations, isRoomPic };
}

export async function hardDeleteReservationsByUser(userId: string) {
  return db.roomReservation.deleteMany({
    where: { reservedById: userId, deletedAt: { not: null } },
  });
}

export async function getUsersByDivisionId(divisionId: string) {
  return db.user.findMany({
    where: { divisionId },
    select: {
      id: true, nik: true, email: true, name: true, role: true,
      createdAt: true, updatedAt: true, ext: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function getUsersByDepartmentId(departmentId: string) {
  return db.user.findMany({
    where: { departmentId },
    select: {
      id: true, nik: true, email: true, name: true, role: true,
      createdAt: true, updatedAt: true, ext: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function getAllUsers(request: Request) {
  await validateSessionWithRole('SUPERADMIN', request);
  return db.user.findMany({
    select: {
      id: true, nik: true, email: true, name: true, role: true,
      createdAt: true, updatedAt: true, ext: true,
      division: true, department: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function getUserByIdController(request: Request, id: string) {
  await validateSessionWithRole('SUPERADMIN', request);
  if (!id) throw new Error('Id is required');
  const user = await getUserById(id);
  if (!user) throw new Error('User does not exist');
  return { user };
}

export async function createUserAction(request: Request, values: CreateUserDTO) {
  await validateSessionWithRole('SUPERADMIN', request);
  const existingNik = await db.user.findUnique({ where: { nik: values.nik } });
  if (existingNik) throw new Error('NIK already exists');
  const existingEmail = await db.user.findUnique({ where: { email: values.email } });
  if (existingEmail) throw new Error('Email already exists');
  const newUser = await createUser(values);
  return { user: newUser };
}

export async function updateUserAction(
  request: Request,
  values: UpdateUserDTO & { isProfileUpdate?: boolean },
) {
  const userId = await validateSession(request);
  const existingUser = await getUserById(values.id);
  if (!existingUser) throw new Error('User does not exist');
  let currentRole: UserRole;
  if (values.isProfileUpdate) {
    if (values.id !== userId) throw new Error('You can only update your own profile');
    currentRole = existingUser.role;
  } else {
    await validateSessionWithRole('SUPERADMIN', request);
    currentRole = values.role!;
  }
  const existingNik = await db.user.findUnique({
    where: { nik: values.nik, NOT: { id: values.id } },
  });
  if (existingNik) throw new Error('NIK already exists');
  const existingEmail = await db.user.findUnique({
    where: { email: values.email, NOT: { id: values.id } },
  });
  if (existingEmail) throw new Error('Email already exists');
  const updatedUser = await updateUser({ ...values, role: currentRole });
  return { user: updatedUser };
}

export async function deleteUserAction(request: Request, id: string) {
  await validateSessionWithRole('SUPERADMIN', request);
  const existingUser = await getUserById(id);
  if (!existingUser) throw new Error('User does not exist');
  const { hasReservations, isRoomPic } = await checkUserCanBeDeleted(id);
  if (hasReservations)
    throw new Error(
      'Cannot delete users with active reservations. Please remove reservations first.',
    );
  if (isRoomPic)
    throw new Error(
      'Cannot delete users who is a person in charge of a rooms. Please reassign the rooms first.',
    );
  await hardDeleteReservationsByUser(id);
  await deleteUser(id);
  return { success: true };
}

export async function changePasswordAction(
  request: Request,
  values: { id: string; currentPassword: string; newPassword: string },
) {
  const userId = await validateSession(request);
  if (values.id !== userId) throw new Error('You can only change your own password');
  const user = await getUserById(values.id, { includeSensitive: true });
  if (!user) throw new Error('User does not exist');
  const isValid = await verifyPassword(values.currentPassword, (user as unknown as { password: string }).password);
  if (!isValid) throw new Error('Current password is incorrect');
  await changeUserPassword(user.id, values.newPassword);
  return { success: true };
}

export async function getUsersByDivisionController(request: Request, divisionId: string) {
  await validateSession(request);
  const users = await getUsersByDivisionId(divisionId);
  return { users };
}

export async function getUsersByDepartmentController(request: Request, departmentId: string) {
  await validateSession(request);
  const users = await getUsersByDepartmentId(departmentId);
  return { users };
}

export async function resetPasswordAction(
  request: Request,
  values: { id: string; newPassword: string },
) {
  await validateSessionWithRole('SUPERADMIN', request);
  const user = await getUserById(values.id);
  if (!user) throw new Error('User does not exist');
  await changeUserPassword(user.id, values.newPassword);
  return { success: true };
}
