import db from '~/lib/db';
import { hashPassword } from '~/server/lib/hash.server';
import { UserRole } from '~/generated/prisma/enums';
import { UserGetPayload } from '~/generated/prisma/models/User';

export const getAllUsers = async () => {
  return db.user.findMany({
    select: {
      id: true,
      nik: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ext: true,
      division: true,
      department: true,
    },
    orderBy: { name: 'asc' },
  });
};

type UserFull = UserGetPayload<{
  include: {
    department: true;
    division: true;
  };
}>;
type UserPublic = Omit<UserFull, 'password'>;
export async function getUserById(
  id: string,
  options: { includeSensitive: true },
): Promise<UserFull | null>;
export async function getUserById(
  id: string,
  options?: { includeSensitive?: false },
): Promise<UserPublic | null>;
export async function getUserById(id: string, options: { includeSensitive?: boolean } = {}) {
  const { includeSensitive = false } = options;

  return db.user.findUnique({
    where: { id },
    ...(!includeSensitive && { omit: { password: true } }),
    include: {
      department: true,
      division: true,
    },
  });
}

export const createUser = async (data: {
  nik: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  ext?: string;
  divisionId?: string;
  departmentId?: string;
}) => {
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
};

export const updateUser = async (data: {
  id: string;
  nik: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  ext?: string;
  divisionId?: string;
  departmentId?: string;
}) => {
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
};

export const changeUserPassword = async (id: string, newPassword: string) => {
  return db.user.update({
    data: {
      password: newPassword,
    },
    where: { id: id },
  });
};

export const deleteUser = async (id: string) => {
  return db.user.delete({ where: { id } });
};

export const checkUserCanBeDeleted = async (id: string) => {
  const reservationCount = await db.roomReservation.count({
    where: { reservedById: id, deletedAt: null },
  });

  const roomPicCount = await db.roomPersonInCharge.count({
    where: { personInChargeId: id },
  });

  return {
    hasReservations: reservationCount > 0,
    isRoomPic: roomPicCount > 0,
    reservationCount,
    roomPicCount,
  };
};

export const hardDeleteReservationsByUser = async (userId: string) => {
  return db.roomReservation.deleteMany({
    where: { reservedById: userId, deletedAt: { not: null } },
  });
};
