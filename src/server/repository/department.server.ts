import db from '~/lib/db';

export const add = async (department: { name: string }) => {
  return db.department.create({
    data: {
      name: department.name,
    },
  });
};

export const edit = async (department: { id: string; name: string }) => {
  return db.department.update({
    data: {
      name: department.name,
    },
    where: {
      id: department.id,
    },
  });
};

export const getAll = async () => {
  return db.department.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getById = async (id: string) => {
  return db.department.findUnique({
    where: { id },
    include: {
      organizations: { include: { division: true } },
    },
  });
};

export const deleteById = async (id: string) => db.department.delete({ where: { id } });
