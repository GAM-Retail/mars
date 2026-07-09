import { validateSession } from '~/server/lib';
import { query } from '@solidjs/router';
import {
  createOrganizer,
  getOrganizerByNik,
  getOrganizersByDivisionId,
  getOrganizersByDepartmentId,
  updateOrganizer,
} from '~/server/repository/organizer.server';

export const getOrganizerByNikController = query(async (nik: string) => {
  'use server';
  await validateSession();

  if (nik?.length !== 6) {
    return null;
  }

  return await getOrganizerByNik(nik);
}, 'getOrganizerByNikController');

export const getOrganizersByDivisionController = query(async (divisionId: string) => {
  'use server';
  await validateSession();
  const organizers = await getOrganizersByDivisionId(divisionId);
  return { organizers };
}, 'getOrganizersByDivision');

export const getOrganizersByDepartmentController = query(async (departmentId: string) => {
  'use server';
  await validateSession();
  const organizers = await getOrganizersByDepartmentId(departmentId);
  return { organizers };
}, 'getOrganizersByDepartment');

export const createOrUpdateOrganizer = async (organizer: {
  nik: string;
  name: string;
  email: string;
  phone: string;
  division: string;
  department: string;
}) => {
  'use server';
  const existingOrganizer = await getOrganizerByNik(organizer.nik);

  let organizerId: string;

  if (existingOrganizer) {
    await updateOrganizer({
      id: existingOrganizer.id,
      nik: organizer.nik,
      name: organizer.name,
      email: organizer.email,
      phone: organizer.phone,
      divisionId: organizer.division,
      departmentId: organizer.department,
    });
    organizerId = existingOrganizer.id;
  } else {
    const newOrganizer = await createOrganizer({
      nik: organizer.nik,
      name: organizer.name,
      email: organizer.email,
      phone: organizer.phone,
      divisionId: organizer.division,
      departmentId: organizer.department,
    });
    organizerId = newOrganizer.id;
  }

  return organizerId;
};
