import 'dotenv/config';
import { hashPassword } from '~/lib/hash.server';
import prisma from '~/lib/db';
import { Prisma, UserRole } from '~/generated/prisma/client';

const seedUser = async () => {
  const INITIAL_USER_PASSWORD = process.env.INITIAL_USER_PASSWORD;
  if (!INITIAL_USER_PASSWORD) {
    throw new Error('INITIAL_USER_PASSWORD is not defined');
  }
  const hashedPassword = await hashPassword(INITIAL_USER_PASSWORD);
  const userData: Prisma.UserCreateInput = {
    name: 'Dimas',
    email: 'alfi.dim@gramedia.com',
    nik: '123456',
    password: hashedPassword,
    role: UserRole.SUPERADMIN,
  };

  console.log('Seeding user: ', userData.email);
  const user = await prisma.user.create({ data: userData });
  console.log('User created: ', user.email);
};

async function main() {
  await seedUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
