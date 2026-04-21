import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '~/generated/prisma/client';

const dbUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port || 3306),
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  connectionLimit: 10,
});

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

  globalForPrisma.__prisma ??= new PrismaClient({ adapter });

  prisma = globalForPrisma.__prisma;
}

export default prisma;
