import { useSession } from '@solidjs/start/http';
import db from '~/lib/db';
import { verifyPassword } from '~/server/lib/hash.server';

export function validateNikOrEmail(value: unknown): {
  valid: boolean;
  message?: string;
  type?: 'nik' | 'email';
} {
  if (typeof value !== 'string' || value.length < 6) {
    return {
      valid: false,
      message: 'Nik or Email must be at least 6 characters long',
    };
  }
  if (String(value).match(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/gm)) {
    return {
      valid: true,
      type: 'email',
    };
  } else if (String(value).match(/^\d{6}$/gm)) {
    return {
      valid: true,
      type: 'nik',
    };
  } else {
    return {
      valid: false,
      message: 'Nik or Email must be a valid email or 6 digit number',
    };
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export async function login(nikOrEmail: string, password: string, type: 'nik' | 'email') {
  const user = await db.user.findUnique({
    where: { ...(type === 'nik' ? { nik: nikOrEmail } : { email: nikOrEmail }) },
  });
  if (!user) throw new Error('User not found');
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error('Incorrect password, please try again');
  return user;
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => {
    d.userId = undefined;
  });
}

// Will implement this later
// export async function register(username: string, password: string) {
//   const existingUser = await db.user.findUnique({ where: { username } });
//   if (existingUser) throw new Error('User already exists');
//   return db.user.create({
//     data: { username: username, password },
//   });
// }

export function getSession() {
  const SESSION_SECRET = process.env.SESSION_SECRET;
  if (!SESSION_SECRET) throw new Error('SESSION_SECRET is not defined');
  return useSession({
    password: SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}
