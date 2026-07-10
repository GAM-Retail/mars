import db from '~/lib/db';
import { validateSession } from '~/lib/session.server';

import type { CreateDivisionDTO, UpdateDivisionDTO } from '~/lib/services/types';

export async function createDivision(data: CreateDivisionDTO) {
  return db.division.create({ data: { name: data.name } });
}

export async function updateDivision(data: UpdateDivisionDTO) {
  return db.division.update({
    data: { name: data.name },
    where: { id: data.id },
  });
}

export async function getAllDivisions() {
  return db.division.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getDivisionByIdRaw(id: string) {
  return db.division.findUnique({
    where: { id },
    include: { organizations: { include: { department: true } } },
  });
}

export async function deleteDivisionById(id: string) {
  return db.division.delete({ where: { id } });
}

export async function addDepartmentToDivision(divisionId: string, departmentId: string) {
  return db.$transaction(async (tx) => {
    const existing = await tx.organizations.findFirst({ where: { divisionId, departmentId } });
    if (existing) throw new Error('Department already added to this division');
    return tx.organizations.create({ data: { divisionId, departmentId } });
  });
}

export async function removeDepartmentFromDivision(divisionId: string, departmentId: string) {
  return db.$transaction(async (tx) => {
    const org = await tx.organizations.findFirst({ where: { divisionId, departmentId } });
    if (org) return tx.organizations.delete({ where: { id: org.id } });
    return null;
  });
}

export async function getDepartmentsByDivisionId(divisionId: string) {
  return db.department.findMany({
    where: { organizations: { some: { divisionId } } },
  });
}

export async function addDivision(request: Request, values: CreateDivisionDTO) {
  if (!values.name) throw new Error('Name is required');
  await validateSession(request);
  const newDivision = await createDivision(values);
  return { division: newDivision };
}

export async function editDivision(request: Request, values: UpdateDivisionDTO) {
  if (!values.name) throw new Error('Name is required');
  await validateSession(request);
  const currentDivision = await getDivisionByIdRaw(values.id);
  if (!currentDivision) throw new Error('Division not found');
  const editedDivision = await updateDivision(values);
  return { division: editedDivision };
}

export async function deleteDivision(request: Request, id: string) {
  if (!id) throw new Error('Id is required');
  await validateSession(request);
  const currentDivision = await getDivisionByIdRaw(id);
  if (!currentDivision) throw new Error('Division not found');
  await deleteDivisionById(id);
  return { success: true };
}

export async function getAllDivision() {
  const divisions = await getAllDivisions();
  return { divisions };
}

export async function getDivisionById(id: string) {
  const division = await getDivisionByIdRaw(id);
  if (!division) throw new Error('Division does not exist');
  return { division };
}

export async function addDepartmentToDivisionAction(
  request: Request,
  divisionId: string,
  departmentId: string,
) {
  await validateSession(request);
  const division = await getDivisionByIdRaw(divisionId);
  if (!division) throw new Error('Division not found');
  await addDepartmentToDivision(divisionId, departmentId);
  return { success: true };
}

export async function removeDepartmentFromDivisionAction(
  request: Request,
  divisionId: string,
  departmentId: string,
) {
  await validateSession(request);
  const division = await getDivisionByIdRaw(divisionId);
  if (!division) throw new Error('Division not found');
  await removeDepartmentFromDivision(divisionId, departmentId);
  return { success: true };
}

export async function getAllDepartmentsForDivision() {
  const departments = await db.department.findMany({ orderBy: { createdAt: 'desc' } });
  return { departments };
}

export async function getDepartmentsByDivisionIdQuery(request: Request, divisionId: string) {
  await validateSession(request);
  const departments = await getDepartmentsByDivisionId(divisionId);
  return { departments };
}

export async function getOrganizationData() {
  const divisionsWithOrgs = await db.division.findMany({
    include: { organizations: { include: { department: true } } },
  });
  const departmentsByDivision: Record<string, { id: string; name: string }[]> = {};
  const seen = new Set<string>();
  const departments: { id: string; name: string }[] = [];

  for (const div of divisionsWithOrgs) {
    departmentsByDivision[div.id] = div.organizations.map((o) => ({
      id: o.department.id,
      name: o.department.name,
    }));
    for (const o of div.organizations) {
      if (!seen.has(o.department.id)) {
        seen.add(o.department.id);
        departments.push({ id: o.department.id, name: o.department.name });
      }
    }
  }

  const divisions = divisionsWithOrgs.map(({ organizations, ...d }) => d);
  return { divisions, departments, departmentsByDivision };
}
