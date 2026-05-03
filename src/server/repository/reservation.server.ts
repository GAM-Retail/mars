import db from '~/lib/db';

export const getAllReservations = async () => {
  return db.roomReservation.findMany({
    include: {
      room: true,
      reservedBy: {
        select: { id: true, name: true, email: true, nik: true, department: true, division: true },
      },
      organizer: true,
    },
    orderBy: { startTime: 'desc' },
  });
};

export const getAllReservationsByPersonInCharge = async (userId: string, roomIds?: string[]) => {
  if (roomIds?.length === 0) {
    return [];
  }

  return db.roomReservation.findMany({
    where: {
      roomId: { in: roomIds },
    },
    include: {
      room: true,
      reservedBy: { select: { id: true, name: true, email: true } },
      organizer: true,
    },
    orderBy: { startTime: 'desc' },
  });
};

export const getReservationById = async (id: string) => {
  return db.roomReservation.findUnique({
    where: { id },
    include: {
      room: true,
      reservedBy: { select: { id: true, name: true, email: true } },
      organizer: true,
    },
  });
};

export const getReservationsByRoomId = async (roomId: string) => {
  return db.roomReservation.findMany({
    where: { roomId },
    include: {
      room: true,
      reservedBy: {
        select: { id: true, name: true, email: true, nik: true, department: true, division: true },
      },
      organizer: true,
    },
    orderBy: { startTime: 'desc' },
  });
};

export const createReservation = async (data: {
  roomId: string;
  reservedById: string;
  organizerId: string;
  startTime: Date;
  endTime: Date;
  agenda?: string;
}) => {
  return db.roomReservation.create({
    data: {
      roomId: data.roomId,
      reservedById: data.reservedById,
      organizerId: data.organizerId,
      startTime: data.startTime,
      endTime: data.endTime,
      agenda: data.agenda,
    },
  });
};

export const updateReservation = async (data: {
  id: string;
  roomId: string;
  organizerId: string;
  startTime: Date;
  endTime: Date;
  agenda?: string;
}) => {
  return db.roomReservation.update({
    data: {
      roomId: data.roomId,
      organizerId: data.organizerId,
      startTime: data.startTime,
      endTime: data.endTime,
      agenda: data.agenda,
    },
    where: { id: data.id },
  });
};

export const deleteReservation = async (id: string) => {
  return db.roomReservation.delete({
    where: { id },
  });
};
