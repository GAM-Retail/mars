import db from '~/lib/db';
import { verifyPassword } from '~/lib/hash.server';
import { getSession } from '~/lib/session.server';
import { UserGetPayload } from '~/generated/prisma/models/User';
import { CurrentUser } from '~/lib/current-user.server';

export function validateNikOrEmail(
  value: unknown,
): { valid: true; type: 'nik' | 'email' } | { valid: false; message: string } {
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
    return 'Passwords must be at least 6 characters long';
  }
}

type LoginResult =
  | {
      user: UserGetPayload<{ omit: { password: true } }>;
    }
  | {
      user: null;
      message: string;
    };

export async function login(
  nikOrEmail: string,
  password: string,
  type: 'nik' | 'email',
): Promise<LoginResult> {
  const user = await db.user.findUnique({
    where: type === 'nik' ? { nik: nikOrEmail } : { email: nikOrEmail },
  });
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return {
      user: null,
      message: 'Incorrect password, please try again',
    };
  }
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
  };
}

export async function getUserSession(request?: Request): Promise<CurrentUser | null> {
  try {
    const session = await getSession(request?.headers.get('Cookie'));
    const userId = session.data.userId;
    if (!userId) return null;
    const user = await db.user.findUnique({
      where: { id: userId },
      omit: { password: true },
      include: { division: true, department: true },
    });
    if (!user) return null;
    return {
      ...user,
      division: user.division,
      department: user.department,
    };
  } catch {
    return null;
  }
}

export async function loginAction(formData: FormData): Promise<
  | {
      success: true;
      user: NonNullable<Awaited<ReturnType<typeof login>>['user']>;
    }
  | { success: false; error: string }
> {
  const nikOrEmail = String(formData.get('nikOrEmail'));
  const validNikOrEmail = validateNikOrEmail(nikOrEmail);
  if (!validNikOrEmail.valid) return { success: false, error: validNikOrEmail.message };
  const password = String(formData.get('password'));
  const error = validatePassword(password);
  if (error) return { success: false, error };
  const data = await login(nikOrEmail, password, validNikOrEmail.type);
  if (!data.user) return { success: false, error: data.message };
  return { success: true, user: data.user };
}
