import { getReservationById, createNotificationLog } from '~/lib/services/reservation.server';
import { buildReservationMessage } from '~/lib/message-template.server';
import { NotificationStatus } from '~/generated/prisma/enums';

interface NotificationConfig {
  apiUrl: string;
  tokenApiUrl: string;
  tokenName: string;
  tokenEmail: string;
  appsName: string;
  appUrl: string;
}

// interface CachedToken {
//   token: string;
//   expiresAt: number;
// }

// const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
//
// let cachedToken: CachedToken | null = null;

import { logger } from '~/lib/logger.server';
import { CurrentUser } from '~/lib/current-user.server';

function consoleLog(level: 'info' | 'warn' | 'error', message: string, data?: unknown) {
  logger[level](`[NOTIFICATION] ${message}`, data);
}

function getConfig(): NotificationConfig {
  const apiUrl = process.env.NOTIFICATION_API_URL;
  const tokenApiUrl = process.env.NOTIFICATION_TOKEN_API_URL;
  const tokenName = process.env.NOTIFICATION_TOKEN_NAME;
  const tokenEmail = process.env.NOTIFICATION_TOKEN_EMAIL;
  const appsName = process.env.NOTIFICATION_TOKEN_APPSNAME || 'MARS';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  if (!apiUrl || !tokenName || !tokenEmail || !tokenApiUrl) {
    throw new Error(
      'Missing notification environment variables: NOTIFICATION_API_URL, NOTIFICATION_TOKEN_API_URL, NOTIFICATION_TOKEN_NAME, NOTIFICATION_TOKEN_EMAIL',
    );
  }

  return { apiUrl, tokenApiUrl, tokenName, tokenEmail, appsName, appUrl };
}

// function getCachedToken(): string | null {
//   if (cachedToken && cachedToken.expiresAt > Date.now()) {
//     return cachedToken.token;
//   }
//   return null;
// }

// ATTENTION: no need to pass token, but leave it here for future change
// export async function getNotificationToken(): Promise<string> {
//   const cached = getCachedToken();
//   if (cached) {
//     consoleLog('info', 'Using cached notification token');
//     return cached;
//   }
//
//   const config = getConfig();
//   consoleLog('info', 'Fetching new notification token');
//
//   const response = await fetch(config.tokenApiUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       name: config.tokenName,
//       appsname: config.appsName,
//       email: config.tokenEmail,
//     }),
//   });
//
//   if (!response.ok) {
//     const errorText = await response.text();
//     consoleLog('error', 'Failed to fetch notification token', {
//       status: response.status,
//       error: errorText,
//     });
//     throw new Error(`Failed to fetch notification token: ${response.status}`);
//   }
//
//   const data = (await response.json()) as { token?: string };
//   if (!data.token) {
//     consoleLog('error', 'No token in response', data);
//     throw new Error('No token in notification API response');
//   }
//
//   cachedToken = {
//     token: data.token,
//     expiresAt: Date.now() + TOKEN_EXPIRY_MS,
//   };
//
//   consoleLog('info', 'Notification token fetched and cached', {
//     expiresIn: TOKEN_EXPIRY_MS / (1000 * 60 * 60) + ' hours',
//   });
//
//   return data.token;
// }

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replaceAll(/\D/g, '');
  const valid = /^08\d{8,11}$/.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 13;

  if (!valid) {
    consoleLog('warn', 'Invalid phone number', { phone, cleaned, length: cleaned.length });
  }

  return valid;
}

export async function sendNotification(phone: string, message: string): Promise<null | string> {
  if (!validatePhone(phone)) {
    consoleLog('warn', 'Skipping notification - invalid phone', { phone });
    return 'invalid phone format';
  }

  const config = getConfig();
  // ATTENTION: no need to pass token, but leave it here for future change
  // let token: string;
  //
  // try {
  //   token = await getNotificationToken();
  // } catch (error) {
  //   consoleLog('error', 'Failed to get notification token', error);
  //   return 'Failed to get notification token: ' + error;
  // }

  consoleLog('info', 'Sending notification', { phone, messageLength: message.length });

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // token: token,
    },
    body: JSON.stringify({
      phonenumber: phone,
      message: message,
      fromapp: 'MARS',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    consoleLog('error', 'Failed to send notification', {
      status: response.status,
      error: errorText,
    });
    return errorText;
  }

  consoleLog('info', 'Notification sent successfully', { phone });
  return null;
}

interface ReservationNotificationOptions {
  reservationId: string;
  reservationLogId?: string;
  status: 'Created' | 'Rescheduled' | 'Cancelled';
  currentUser: {
    id: string;
    name: string;
    ext: string | null;
  };
}

export async function sendReservationNotification(
  options: ReservationNotificationOptions,
): Promise<boolean> {
  const { reservationId, reservationLogId, status, currentUser } = options;

  const reservation = await getReservationById(currentUser as CurrentUser, reservationId);
  if (!reservation) {
    consoleLog('error', 'Reservation not found for notification', { reservationId });
    return false;
  }

  if (!reservation.organizer) {
    consoleLog('error', 'Organizer not found for reservations', { reservationId });
    return false;
  }

  if (!reservation.room) {
    consoleLog('error', 'Home not found for reservations', { reservationId });
    return false;
  }

  const organizer = reservation.organizer as unknown as {
    phone: string;
    name: string;
    nik: string;
    department: { id: string; name: string } | null;
  };
  const room = reservation.room as unknown as {
    name: string;
    location: string;
  };

  if (!validatePhone(organizer.phone)) {
    consoleLog('warn', 'Skipping notification - organizer has invalid phone', {
      reservationId,
      organizerPhone: organizer.phone,
      organizerNik: organizer.nik,
    });

    await createNotificationLog({
      reservationId,
      reservationLogId,
      phone: organizer.phone,
      status: NotificationStatus.SKIPPED,
      error: 'invalid_phone_format',
    });

    return false;
  }

  const message = buildReservationMessage({
    userName: organizer.name,
    status: status,
    startTime: reservation.startTime,
    endTime: reservation.endTime,
    roomName: room.name,
    location: room.location,
    department: organizer.department?.name ?? '-',
    secretariatName: currentUser.name,
    secretariatExt: currentUser.ext || '-',
  });

  consoleLog('info', 'Sending reservations notification', {
    reservationId,
    status,
    organizerPhone: organizer.phone,
    organizerName: organizer.name,
  });

  const err = await sendNotification(organizer.phone, message);

  await createNotificationLog({
    reservationId,
    reservationLogId,
    phone: organizer.phone,
    status: err ? NotificationStatus.FAILED : NotificationStatus.SUCCESS,
    error: err || undefined,
    message: 'Notification ' + (err ? 'failed' : 'sent successfully'),
  });

  return true;
}
