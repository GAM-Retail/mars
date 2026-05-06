import { action, json, query } from '@solidjs/router';
import {
  checkOverlappingReservations,
  createReservation,
  deleteReservation,
  getAllReservations,
  getAllReservationsByPersonInCharge,
  getReservationById,
  getReservationsByRoomId,
  getReservationsByRoomIds,
  updateReservation,
} from '~/server/repository/reservation.server';
import { dateTimeBuilder, validateSession, validateSessionWithRole } from '~/server/lib';
import { NotFoundError } from '~/lib/error';
import { createOrUpdateOrganizer } from '~/server/controller/organizer.server';
import { validateRoomPersonInCharge } from '~/server/controller/room.server';
import { Reservation } from '~/components/kibo-ui/reservation-calendar';
import { getUserById } from '~/server/repository/user.server';

export const getAllReservationsForCalendar = query(async () => {
  'use server';
  const userId = await validateSession();

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  if (user.role === 'SUPERADMIN') {
    return await getAllReservations();
  }

  await validateSessionWithRole('ADMIN');
  return await getAllReservations();
}, 'getAllReservationsForCalendar');

const reservationMapper = (reservation: Reservation) => ({
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
});
export const getAllReservationsByPersonInChargeQuery = query(async (roomIds: string[]) => {
  'use server';
  const userId = await validateSession();

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  if (user.role === 'SUPERADMIN') {
    const allReservations = await getReservationsByRoomIds(roomIds);
    return allReservations.map(reservationMapper);
  }

  const validatedUserId = await validateSessionWithRole('ADMIN');
  return await getAllReservationsByPersonInCharge(validatedUserId, roomIds).then((reservations) => {
    return reservations.map(reservationMapper);
  });
}, 'getAllReservationsByPersonInChargeQuery');

export const getReservationByIdController = query(async (id: string) => {
  'use server';
  if (!id) {
    throw new Error('Id is required');
  }

  const userId = await validateSession();

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const reservation = await getReservationById(id);

  if (!reservation) {
    throw new NotFoundError('Reservation does not exist');
  }

  if (user.role !== 'SUPERADMIN') {
    const isPic = await validateRoomPersonInCharge(userId, reservation.roomId);
    if (!isPic) {
      throw new Error('You are not the person in charge for this room');
    }
  }

  return { reservation };
}, 'getReservationById');

export const createReservationAction = action(
  async (values: {
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
  }) => {
    'use server';
    const userId = await validateSessionWithRole('ADMIN');

    const isPic = await validateRoomPersonInCharge(userId, values.roomId);
    if (!isPic) {
      throw new Error('You are not the person in charge for this room');
    }

    const startTime = dateTimeBuilder(values.date, values.startTime);
    const endTime = dateTimeBuilder(values.date, values.endTime);

    if (startTime >= endTime) {
      throw new Error('End time must be after start time');
    }

    const overlapping = await checkOverlappingReservations(values.roomId, startTime, endTime);
    if (overlapping) {
      throw new Error('This time slot conflicts with an existing reservation');
    }

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
      reservedById: userId,
      organizerId,
      startTime,
      endTime,
      agenda: values.agenda,
    });

    return { reservation };
  },
);

export const updateReservationAction = action(
  async (values: {
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
  }) => {
    'use server';
    const userId = await validateSessionWithRole('ADMIN');

    const existingReservation = await getReservationById(values.id);
    if (!existingReservation) {
      throw new NotFoundError('Reservation does not exist');
    }

    const isPic = await validateRoomPersonInCharge(userId, existingReservation.roomId);
    if (!isPic) {
      throw new Error('You are not the person in charge for this room');
    }

    const startTime = dateTimeBuilder(values.date, values.startTime);
    const endTime = dateTimeBuilder(values.date, values.endTime);

    if (startTime >= endTime) {
      throw new Error('End time must be after start time');
    }

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
      organizerId,
      startTime,
      endTime,
      agenda: values.agenda,
    });

    return { reservation };
  },
);

export const deleteReservationAction = action(async (id: string) => {
  'use server';
  const userId = await validateSessionWithRole('ADMIN');

  const existingReservation = await getReservationById(id);
  if (!existingReservation) {
    throw new NotFoundError('Reservation does not exist');
  }

  const isPic = await validateRoomPersonInCharge(userId, existingReservation.roomId);
  if (!isPic) {
    throw new Error('You are not the person in charge for this room');
  }

  await deleteReservation(id);

  return json({ success: true }, { revalidate: [] });
});

export const getReservationsByRoom = query(async (roomId: string) => {
  'use server';
  const adminId = await validateSessionWithRole('ADMIN').catch(() => null); // catch the error intentionally to prevent forbidden error
  if (adminId) {
    const isPic = await validateRoomPersonInCharge(adminId, roomId);
    if (!isPic) {
      throw new Error('You are not the person in charge for this room');
    }
  } else {
    await validateSessionWithRole('SUPERADMIN');
  }
  return await getReservationsByRoomId(roomId);
}, 'getReservationsByRoom');

export const getPublicReservations = query(async () => {
  'use server';
  const reservations = await getAllReservations();

  return reservations.map((reservation) => ({
    ...reservation,
    agenda: 'Reserved',
  }));
}, 'getPublicReservations');
