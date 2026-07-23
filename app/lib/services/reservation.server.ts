import db from '~/lib/db';
import { dateTimeBuilder, validateSessionWithRole } from '~/lib/session.server';

import { createOrUpdateOrganizer } from '~/lib/services/organizer.server';
import { validateRoomPersonInCharge } from '~/lib/services/room.server';
import { CurrentUser, requireAdminOrSuperAdmin } from '~/lib/current-user.server';
import { sendReservationNotification } from '~/lib/notification.server';
import { NotificationStatus, ReservationAction } from '~/generated/prisma/enums';
import { CreateReservationDTO, UpdateReservationDTO } from '~/lib/services/types';

const reservationInclude = {
  room: true,
  reservedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      nik: true,
      department: true,
      division: true,
      ext: true,
    },
  },
  organizer: { include: { department: true, division: true } },
} as const;

export async function getReservationById(user: CurrentUser, id: string) {
  return db.roomReservation.findUnique({
    where: {
      id,
      OR: [{ reservedById: user.id }, { reservedBy: { departmentId: user.departmentId } }],
    },
    include: reservationInclude,
  });
}

export async function getAllReservations(includeDeleted?: boolean) {
  return db.roomReservation.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    include: reservationInclude,
    orderBy: { startTime: 'desc' },
  });
}

export async function getReservationsByPersonInCharge(
  user: CurrentUser,
  roomIds?: string[] | 'all',
  includeDeleted?: boolean,
) {
  if (roomIds?.length === 0) return [];
  return db.roomReservation.findMany({
    where: {
      ...(Array.isArray(roomIds) && { roomId: { in: roomIds } }),
      OR: [
        { reservedById: user.id },
        {
          reservedBy: {
            departmentId: user.departmentId,
          },
        },
      ],
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: reservationInclude,
    orderBy: { startTime: 'desc' },
  });
}

export async function getReservationsByRoomIds(
  roomIds: string[] | 'all',
  includeDeleted?: boolean,
) {
  return db.roomReservation.findMany({
    where: {
      ...(Array.isArray(roomIds) && { roomId: { in: roomIds } }),
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: reservationInclude,
    orderBy: { startTime: 'desc' },
  });
}

export async function getReservationsByRoomId(roomId: string) {
  return db.roomReservation.findMany({
    where: { roomId, deletedAt: null },
    include: reservationInclude,
    orderBy: { startTime: 'desc' },
  });
}

export async function checkOverlappingReservations(
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeReservationId?: string,
) {
  const whereClause = {
    roomId,
    deletedAt: null,
    OR: [{ startTime: { lt: endTime }, endTime: { gt: startTime } }],
  };
  if (excludeReservationId) {
    return db.roomReservation.findFirst({
      where: { ...whereClause, id: { not: excludeReservationId } },
    });
  }
  return db.roomReservation.findFirst({ where: whereClause });
}

export async function createReservation(data: CreateReservationDTO) {
  return db.roomReservation.create({ data });
}

export async function updateReservation(data: UpdateReservationDTO) {
  return db.roomReservation.update({
    data,
    where: { id: data.id },
  });
}

export async function deleteReservation(id: string) {
  return db.roomReservation.update({ data: { deletedAt: new Date() }, where: { id } });
}

export async function createReservationLog(data: {
  reservationId: string;
  action: ReservationAction;
  performedBy: string;
  performedByName?: string;
  changes?: Record<string, string | object>;
}) {
  return db.roomReservationLog.create({ data });
}

export async function createNotificationLog(data: {
  reservationId: string;
  reservationLogId?: string;
  phone: string;
  status: NotificationStatus;
  error?: string;
  message?: string;
}) {
  return db.roomReservationNotificationLog.create({ data });
}

export const reservationMapper = (reservation: {
  id: string;
  roomId: string;
  room: { name: string };
  organizerId: string;
  organizer: { name: string; nik: string };
  startTime: Date;
  endTime: Date;
  reservedById: string;
  reservedBy: { name: string };
  agenda: string | null;
  deletedAt: Date | null;
}) => ({
  id: reservation.id,
  roomId: reservation.roomId,
  roomName: reservation.room.name,
  organizerId: reservation.organizerId,
  organizerName: reservation.organizer.name,
  organizerNik: reservation.organizer.nik,
  startTime: reservation.startTime,
  endTime: reservation.endTime,
  reservedById: reservation.reservedById,
  reservedByName: reservation.reservedBy.name,
  agenda: reservation.agenda,
  deletedAt: reservation.deletedAt,
});

export async function createReservationAction(
  request: Request,
  values: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    organizerNik: string;
    organizerName: string;
    organizerEmail: string;
    organizerPhone: string;
    organizerDivision?: string;
    organizerDepartment?: string;
    agenda?: string;
  },
) {
  const user = await requireAdminOrSuperAdmin(request);
  if (user.role !== 'SUPERADMIN') {
    const isPic = await validateRoomPersonInCharge(user.id, values.roomId);
    if (!isPic) throw new Error('You are not the person in charge for this rooms');
  }
  const date = values.date.split('T')[0];
  const startTime = dateTimeBuilder(date, values.startTime);
  const endTime = dateTimeBuilder(date, values.endTime);
  if (startTime >= endTime) throw new Error('End time must be after start time');
  const overlapping = await checkOverlappingReservations(values.roomId, startTime, endTime);
  if (overlapping) throw new Error('This time slot conflicts with an existing reservations');
  const organizerId = await createOrUpdateOrganizer({
    nik: values.organizerNik,
    name: values.organizerName,
    email: values.organizerEmail,
    phone: values.organizerPhone,
    division: values.organizerDivision ?? '',
    department: values.organizerDepartment ?? '',
  });
  const reservation = await createReservation({
    roomId: values.roomId,
    reservedById: user.id,
    organizerId,
    startTime,
    endTime,
    agenda: values.agenda,
  });
  const reservationLog = await createReservationLog({
    reservationId: reservation.id,
    action: 'CREATE',
    performedBy: user.id,
    performedByName: user.name,
    changes: {
      roomId: values.roomId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      agenda: values?.agenda || '',
      organizerNik: values.organizerNik,
    },
  });
  await sendReservationNotification({
    reservationId: reservation.id,
    reservationLogId: reservationLog.id,
    status: 'Created',
    currentUser: { id: user.id, name: user.name, ext: user.ext },
  });
  return { reservation };
}

export async function updateReservationAction(
  request: Request,
  values: {
    id: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    organizerNik: string;
    organizerName: string;
    organizerEmail: string;
    organizerPhone: string;
    organizerDivision?: string;
    organizerDepartment?: string;
    agenda?: string;
  },
) {
  const user = await requireAdminOrSuperAdmin(request);
  const existingReservation = await getReservationById(user, values.id);
  if (!existingReservation) throw new Error('Reservation does not exist');
  if (existingReservation.deletedAt) throw new Error('Cannot edit deleted reservations');
  if (existingReservation.endTime < new Date()) throw new Error('Cannot edit past reservations');
  if (user.role !== 'SUPERADMIN') {
    const isPic = await validateRoomPersonInCharge(user.id, existingReservation.roomId);
    if (!isPic) throw new Error('You are not the person in charge for this rooms');
  }
  const startTime = dateTimeBuilder(values.date, values.startTime);
  const endTime = dateTimeBuilder(values.date, values.endTime);
  if (startTime >= endTime) throw new Error('End time must be after start time');
  const overlapping = await checkOverlappingReservations(
    values.roomId,
    startTime,
    endTime,
    values.id,
  );
  if (overlapping) throw new Error('This time slot conflicts with an existing reservations');
  const organizerId = await createOrUpdateOrganizer({
    nik: values.organizerNik,
    name: values.organizerName,
    email: values.organizerEmail,
    phone: values.organizerPhone,
    division: values.organizerDivision ?? '',
    department: values.organizerDepartment ?? '',
  });
  const reservation = await updateReservation({
    id: values.id,
    roomId: values.roomId,
    reservedById: user.id,
    organizerId,
    startTime,
    endTime,
    agenda: values.agenda,
  });
  const reservationLog = await createReservationLog({
    reservationId: values.id,
    action: 'UPDATE',
    performedBy: user.id,
    performedByName: user.name,
    changes: {
      before: {
        roomId: existingReservation.roomId,
        startTime: existingReservation.startTime.toISOString(),
        endTime: existingReservation.endTime.toISOString(),
        agenda: existingReservation.agenda,
      },
      after: {
        roomId: values.roomId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        agenda: values.agenda,
      },
    },
  });
  await sendReservationNotification({
    reservationId: values.id,
    reservationLogId: reservationLog.id,
    status: 'Rescheduled',
    currentUser: { id: user.id, name: user.name, ext: user.ext },
  });
  return { reservation };
}

export async function deleteReservationAction(request: Request, id: string) {
  const user = await requireAdminOrSuperAdmin(request);
  const existingReservation = await getReservationById(user, id);
  if (!existingReservation) throw new Error('Reservation does not exist');
  if (existingReservation.deletedAt) throw new Error('Reservation is already deleted');
  if (existingReservation.endTime < new Date()) throw new Error('Cannot delete past reservations');
  if (user.role !== 'SUPERADMIN') {
    const isPic = await validateRoomPersonInCharge(user.id, existingReservation.roomId);
    if (!isPic) throw new Error('You are not the person in charge for this rooms');
  }
  await deleteReservation(id);
  const reservationLog = await createReservationLog({
    reservationId: id,
    action: 'DELETE',
    performedBy: user.id,
    performedByName: user.name,
    changes: {
      roomId: existingReservation.roomId,
      startTime: existingReservation.startTime.toISOString(),
      endTime: existingReservation.endTime.toISOString(),
      agenda: existingReservation?.agenda || '-',
    },
  });
  await sendReservationNotification({
    reservationId: id,
    reservationLogId: reservationLog.id,
    status: 'Cancelled',
    currentUser: { id: user.id, name: user.name, ext: user.ext },
  });
  return { success: true };
}

export async function getPublicReservations() {
  const reservations = await getAllReservations();
  return reservations.map((reservation) => ({ ...reservation, agenda: 'Reserved' }));
}

export async function getReservationLogsController(request: Request, reservationId: string) {
  await validateSessionWithRole(['ADMIN', 'SUPERADMIN'], request);
  return db.roomReservationLog.findMany({
    where: { reservationId },
    orderBy: { createdAt: 'desc' },
  });
}
