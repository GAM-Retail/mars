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
    include: {
      organizations: { include: { department: true } },
    },
  });
};

export const deleteById = async (id: string) => db.division.delete({ where: { id } });

export const addDepartmentToDivision = async (divisionId: string, departmentId: string) => {
  const existing = await db.organizations.findFirst({
    where: { divisionId: divisionId, departmentId },
  });
  if (existing) {
    throw new Error('Department already added to this division');
  }
  return db.organizations.create({
    data: { divisionId: divisionId, departmentId },
  });
};

export const removeDepartmentFromDivision = async (divisionId: string, departmentId: string) => {
  const org = await db.organizations.findFirst({
    where: { divisionId: divisionId, departmentId },
  });
  if (org) {
    return db.organizations.delete({ where: { id: org.id } });
  }
  return null;
};
