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
    },
    orderBy: { name: 'asc' },
  });
};

type UserPublic = {
  id: string;
  nik: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
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
}) => {
  const hashedPassword = await hashPassword(data.password);
  return db.user.create({
    data: {
      nik: data.nik,
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
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
}) => {
  return db.user.update({
    data: {
      nik: data.nik,
      email: data.email,
      name: data.name,
      role: data.role,
      ...(data.password && { password: await hashPassword(data.password) }),
    },
    where: { id: data.id },
  });
};

export const deleteUser = async (id: string) => {
  return db.user.delete({ where: { id } });
};
