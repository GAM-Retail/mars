import { action, json, query } from '@solidjs/router';
import {
  createReservation,
  deleteReservation,
  getAllReservations,
  getAllReservationsByPersonInCharge,
  getReservationById,
  getReservationsByRoomId,
  updateReservation,
} from '~/server/repository/reservation.server';
import { dateTimeBuilder, validateSessionWithRole } from '~/server/lib';
import { NotFoundError } from '~/lib/error';
import { createOrUpdateOrganizer } from '~/server/controller/organizer.server';
import { validateRoomPersonInCharge } from '~/server/controller/room.server';

export const getAllReservationsForCalendar = query(async () => {
  'use server';
  await validateSessionWithRole('ADMIN');

  return await getAllReservations();
}, 'getAllReservationsForCalendar');

export const getAllReservationsByPersonInChargeQuery = query(async (roomIds: string[]) => {
  'use server';
  const userId = await validateSessionWithRole('ADMIN');
  return await getAllReservationsByPersonInCharge(userId, roomIds).then((reservations) => {
    return reservations.map((reservation) => ({
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
    }));
  });
}, 'getAllReservationsByPersonInChargeQuery');

export const getReservationByIdController = query(async (id: string) => {
  'use server';
  if (!id) {
    throw new Error('Id is required');
  }

  const userId = await validateSessionWithRole('ADMIN');
  const reservation = await getReservationById(id);

  if (!reservation) {
    throw new NotFoundError('Reservation does not exist');
  }

  const isPic = await validateRoomPersonInCharge(userId, reservation.roomId);
  if (!isPic) {
    throw new Error('You are not the person in charge for this room');
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
  await validateSessionWithRole('ADMIN');
  const isPic = await validateRoomPersonInCharge(await validateSessionWithRole('ADMIN'), roomId);
  if (!isPic) {
    throw new Error('You are not the person in charge for this room');
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
