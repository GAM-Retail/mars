import db from '~/lib/db';
import { validateSession } from '~/lib/session.server';

export async function getOrganizerByNik(nik: string) {
  return db.organizer.findFirst({
    where: { nik },
    include: { department: true, division: true },
  });
}

export async function getOrganizersByDivisionId(divisionId: string) {
  return db.organizer.findMany({
    where: { divisionId },
    select: { id: true, nik: true, name: true, email: true, phone: true },
    orderBy: { name: 'asc' },
  });
}

export async function getOrganizersByDepartmentId(departmentId: string) {
  return db.organizer.findMany({
    where: { departmentId },
    select: { id: true, nik: true, name: true, email: true, phone: true },
    orderBy: { name: 'asc' },
  });
}

export async function createOrUpdateOrganizer(organizer: {
  nik: string;
  name: string;
  email: string;
  phone: string;
  division: string;
  department: string;
}) {
  return db.$transaction(async (tx) => {
    const existing = await tx.organizer.findFirst({
      where: { nik: organizer.nik },
    });
    if (existing) {
      await tx.organizer.update({
        data: {
          name: organizer.name,
          email: organizer.email,
          phone: organizer.phone,
          departmentId: organizer.department,
          divisionId: organizer.division,
        },
        where: { id: existing.id },
      });
      return existing.id;
    }
    const created = await tx.organizer.create({
      data: {
        nik: organizer.nik,
        name: organizer.name,
        email: organizer.email,
        phone: organizer.phone,
        departmentId: organizer.department,
        divisionId: organizer.division,
      },
    });
    return created.id;
  });
}

export async function getOrganizerByNikController(request: Request, nik: string) {
  await validateSession(request);
  if (nik?.length !== 6) return null;
  return await getOrganizerByNik(nik);
}

export async function getOrganizersByDivisionController(request: Request, divisionId: string) {
  await validateSession(request);
  const organizers = await getOrganizersByDivisionId(divisionId);
  return { organizers };
}

export async function getOrganizersByDepartmentController(request: Request, departmentId: string) {
  await validateSession(request);
  const organizers = await getOrganizersByDepartmentId(departmentId);
  return { organizers };
}
