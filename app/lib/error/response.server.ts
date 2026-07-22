import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { dataWithToast } from '~/lib/utils.server';

export function catchResult(request: Request, err: unknown) {
  let message = err instanceof Error ? err.message : 'An unexpected error occurred';
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2000') {
      message = 'Input value is too long';
    }
    if (err.code === 'P2002') {
      message = `Duplicate value violates unique constraint`;
      if (err.message.includes('email')) {
        message = 'The provided email is already in use. Please choose a different email.';
      }
      if (err.message.includes('nik')) {
        message = 'NIK is not valid, please choose a different NIK';
      }
    }
  }
  return dataWithToast(request, null, {
    type: 'error',
    title: 'Oops! Something went wrong',
    description: message,
  });
}
