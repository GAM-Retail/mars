import db from '~/lib/db';
import { validateSession } from '~/lib/session.server';

import type { CreateDepartmentDTO, UpdateDepartmentDTO } from '~/lib/services/types';

export async function createDepartment(data: CreateDepartmentDTO) {
  return db.department.create({ data: { name: data.name } });
}

export async function updateDepartment(data: UpdateDepartmentDTO) {
  return db.department.update({
    data: { name: data.name },
    where: { id: data.id },
  });
}

export async function getAllDepartments() {
  return db.department.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getDepartmentByIdRaw(id: string) {
  return db.department.findUnique({
    where: { id },
    include: { organizations: { include: { division: true } } },
  });
}

export async function deleteDepartmentById(id: string) {
  return db.department.delete({ where: { id } });
}

export async function addDepartment(request: Request, values: CreateDepartmentDTO) {
  if (!values.name) throw new Error('Name is required');
  await validateSession(request);
  const newDepartment = await createDepartment(values);
  return { department: newDepartment };
}

export async function editDepartment(request: Request, values: UpdateDepartmentDTO) {
  if (!values.name) throw new Error('Name is required');
  await validateSession(request);
  const currentDepartment = await getDepartmentByIdRaw(values.id);
  if (!currentDepartment) throw new Error('Department not found');
  const editedDepartment = await updateDepartment(values);
  return { department: editedDepartment };
}

export async function deleteDepartment(request: Request, id: string) {
  if (!id) throw new Error('Id is required');
  await validateSession(request);
  const currentDepartment = await getDepartmentByIdRaw(id);
  if (!currentDepartment) throw new Error('Department not found');
  await deleteDepartmentById(id);
  return { success: true };
}

export async function getAllDepartment() {
  const departments = await getAllDepartments();
  return { departments };
}

export async function getDepartmentById(id: string) {
  const department = await getDepartmentByIdRaw(id);
  if (!department) throw new Error('Department does not exist');
  return { department };
}
