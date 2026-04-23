import { UserRole } from '~/generated/prisma/enums';

export type CurrentUser = { id: string; name: string; email: string; nik: string; role: UserRole };
export { UserRole } from '~/generated/prisma/enums';
