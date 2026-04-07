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
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
