import db from '~/lib/db';
import { hashPassword } from '~/lib/hash.server';
import { validateSession, validateSessionWithRole } from '~/lib/session.server';

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

export async function deleteUser(id: string, actorId: string) {
  // remove user as room person in charge
  await db.roomPersonInCharge.deleteMany({ where: { personInChargeId: id } });

  // delete user reservations
  const { reservationIds } = await checkUserActiveReservations(id);
  await db.roomReservation.updateMany({
    where: {
      reservedById: id,
      id: {
        notIn: reservationIds.map(({ id }) => id),
      },
    },
    data: {
      reservedById: actorId,
    },
  });
  return db.user.delete({ where: { id } });
}

// Active reservations mean that the reservation is not started yet
export async function checkUserActiveReservations(id: string) {
  const reservationIds = await db.roomReservation.findMany({
    where: {
      reservedById: id,
      endTime: {
        gte: new Date(),
      },
    },
    select: { id: true },
  });
  return { reservationIds, hasReservations: reservationIds.length > 0 };
}

export async function getUsersByDivisionId(divisionId: string) {
  return db.user.findMany({
    where: { divisionId },
    select: {
      id: true,
      nik: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ext: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function getUsersByDepartmentId(departmentId: string) {
  return db.user.findMany({
    where: { departmentId },
    select: {
      id: true,
      nik: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ext: true,
    },
    orderBy: { name: 'asc' },
  });
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
