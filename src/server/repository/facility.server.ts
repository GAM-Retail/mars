import db from '~/lib/db';
export const add = async (facility: { name: string; createdBy: string; description?: string }) => {
  return db.facility.create({
    data: {
      name: facility.name,
      description: facility?.description ?? '',
      createdBy: facility.createdBy,
    },
  });
};

export const edit = async (facility: { id: string; name: string; description?: string }) => {
  return db.facility.update({
    data: {
      name: facility.name,
      description: facility?.description ?? '',
    },
    where: {
      id: facility.id,
    },
  });
};

export const getAll = async () => {
  return db.facility.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getById = async (id: string) => {
  return db.facility.findUnique({
    where: {
      id: id,
    },
    include: {
      createdByUser: true,
    },
  });
};

export const deleteById = async (id: string) => db.facility.delete({ where: { id } });

export const getRoomsByFacilityId = async (facilityId: string) => {
  return db.roomFacility.findMany({
    where: { facilityId },
    include: {
      room: {
        include: {
          createdByUser: true,
          roomFacilities: {
            include: { facility: true },
          },
        },
      },
    },
  });
};
