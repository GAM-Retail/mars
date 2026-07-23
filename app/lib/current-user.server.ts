import { validateSession } from '~/lib/session.server';
import { getUserById } from '~/lib/services/user.server';

import type { UserRole } from '~/generated/prisma/enums';
import type { Department } from '~/generated/prisma/client';

export interface CurrentUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  nik: string;
  ext: string | null;
  divisionId: string | null;
  departmentId: string | null;
  division: Department | null;
  department: Department | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentUser(request: Request): Promise<CurrentUser> {
  const userId = await validateSession(request);
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  return user as CurrentUser;
}

export async function requireAdminOrSuperAdmin(request: Request): Promise<CurrentUser> {
  const user = await getCurrentUser(request);
  if (user.role !== 'SUPERADMIN' && user.role !== 'ADMIN') {
    throw new Error('You do not have permission');
  }
  return user;
}

export async function requireSuperAdmin(request: Request): Promise<CurrentUser> {
  const user = await getCurrentUser(request);
  if (user.role !== 'SUPERADMIN') {
    throw new Error('You do not have permission');
  }
  return user;
}
