import { UserRole } from '~/generated/prisma/enums';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  nik: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  ext: string | null;
  division: string | null;
  department: string | null;
};
export { UserRole } from '~/generated/prisma/enums';
