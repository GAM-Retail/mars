import db from '~/lib/db';
import { hashPassword } from '~/lib/hash.server';
import { UserRole } from '~/generated/prisma/enums';

export const getAllUsers = async () => {
  return db.user.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getUserById = async (id: string) => {
  return db.user.findUnique({
    where: { id },
  });
};

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
