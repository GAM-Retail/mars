import db from '~/lib/db';

export const add = async (division: { name: string }) => {
  return db.division.create({
    data: {
      name: division.name,
    },
  });
};

export const edit = async (division: { id: string; name: string }) => {
  return db.division.update({
    data: {
      name: division.name,
    },
    where: {
      id: division.id,
    },
  });
};

export const getAll = async () => {
  return db.division.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getById = async (id: string) => {
  return db.division.findUnique({
    where: { id },
  });
};

export const deleteById = async (id: string) => db.division.delete({ where: { id } });
