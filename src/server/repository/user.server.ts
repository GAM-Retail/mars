import db from '~/lib/db';
import { hashPassword } from '~/server/lib/hash.server';
import { UserRole } from '~/generated/prisma/enums';

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

type UserPublic = {
  id: string;
  nik: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  ext: string | null;
  division: string | null;
  department: string | null;
};
type UserFull = UserPublic & { password: string };

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
      ...(includeSensitive && { password: true }),
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
  division?: string;
  department?: string;
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
      division: data.division,
      department: data.department,
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
  division?: string;
  department?: string;
}) => {
  return db.user.update({
    data: {
      nik: data.nik,
      email: data.email,
      name: data.name,
      role: data.role,
      ...(data.password && { password: await hashPassword(data.password) }),
      ext: data.ext,
      division: data.division,
      department: data.department,
    },
    where: { id: data.id },
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
