import db from '~/lib/db';

export const getAllOrganizers = async () => {
  return db.organizer.findMany({
    select: {
      id: true,
      nik: true,
      name: true,
      email: true,
      phone: true,
      department: true,
      division: true,
    },
    orderBy: { name: 'asc' },
  });
};

export const getOrganizerByNik = async (nik: string) => {
  'use server';
  return db.organizer.findFirst({
    where: { nik },
    include: {
      department: true,
      division: true,
    },
  });
};

export const getOrganizerById = async (id: string) => {
  return db.organizer.findUnique({
    where: { id },
  });
};

export const createOrganizer = async (data: {
  nik: string;
  name: string;
  email: string;
  phone: string;
  departmentId?: string;
  divisionId?: string;
}) => {
  'use server';
  return db.organizer.create({
    data: {
      nik: data.nik,
      name: data.name,
      email: data.email,
      phone: data.phone,
      departmentId: data.departmentId,
      divisionId: data.divisionId,
    },
  });
};

export const updateOrganizer = async (data: {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
  departmentId?: string;
  divisionId?: string;
}) => {
  'use server';
  return db.organizer.update({
    data: {
      nik: data.nik,
      name: data.name,
      email: data.email,
      phone: data.phone,
      departmentId: data.departmentId,
      divisionId: data.divisionId,
    },
    where: { id: data.id },
  });
};
