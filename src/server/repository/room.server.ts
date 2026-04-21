import db from '~/lib/db';

export const add = async (room: {
  name: string;
  location: string;
  capacity: number;
  createdBy: string;
  description?: string;
}) => {
  return db.room.create({
    data: {
      name: room.name,
      location: room.location,
      capacity: room.capacity,
      description: room.description ?? '',
      createdBy: room.createdBy,
    },
  });
};

export const getAll = () => {
  return db.room.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getById = (id: string) => {
  return db.room.findUnique({
    where: {
      id: id,
    },
    include: {
      createdByUser: true,
      roomFacilities: {
        include: {
          facility: true,
        },
      },
      roomPersonInCharges: {
        include: {
          personInCharge: true,
        },
      },
    },
  });
};

export const deleteById = async (id: string) => db.room.delete({ where: { id } });

export const edit = async (room: {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description?: string;
}) => {
  return db.room.update({
    data: {
      name: room.name,
      location: room.location,
      capacity: room.capacity,
      description: room.description ?? '',
    },
    where: {
      id: room.id,
    },
  });
};

export const addFacilityToRoom = async (roomId: string, facilityId: string) => {
  const roomFacility = await db.roomFacility.findFirst({
    where: {
      roomId,
      facilityId,
    },
  });
  if (roomFacility) {
    throw new Error('Facility already added to room');
  }
  return db.roomFacility.create({
    data: {
      roomId,
      facilityId,
    },
  });
};

export const removeFacilityFromRoom = async (roomId: string, facilityId: string) => {
  const roomFacility = await db.roomFacility.findFirst({
    where: {
      roomId,
      facilityId,
    },
  });
  if (roomFacility) {
    return db.roomFacility.delete({
      where: { id: roomFacility.id },
    });
  }
  return null;
};

export const addPersonInCharge = async (roomId: string, personInChargeId: string) => {
  const roomPersonInCharge = await db.roomPersonInCharge.findFirst({
    where: {
      roomId,
      personInChargeId,
    },
  });
  if (roomPersonInCharge) {
    throw new Error('Person already added to room');
  }
  return db.roomPersonInCharge.create({
    data: {
      roomId,
      personInChargeId,
    },
  });
};

export const removePersonInCharge = async (roomId: string, personInChargeId: string) => {
  const pic = await db.roomPersonInCharge.findFirst({
    where: {
      roomId,
      personInChargeId,
    },
  });
  if (pic) {
    return db.roomPersonInCharge.delete({
      where: { id: pic.id },
    });
  }
  return null;
};
