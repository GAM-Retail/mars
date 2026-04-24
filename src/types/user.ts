import { UserRole } from '~/generated/prisma/enums';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  nik: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
export { UserRole } from '~/generated/prisma/enums';
