import { action, json, query } from '@solidjs/router';
import { add, deleteById, edit, getAll, getById } from '~/server/repository/department.server';
import { validateSession } from '~/server/lib';
import { NotFoundError } from '~/lib/error';

export const addDepartment = action(async (values: { name: string }) => {
  'use server';
  if (!values.name) throw new Error('Name is required');

  await validateSession();

  const newDepartment = await add({ ...values });

  return { department: newDepartment };
});

export const editDepartment = action(async (values: { id: string; name: string }) => {
  'use server';
  if (!values.name) throw new Error('Name is required');

  await validateSession();

  const currentDepartment = await getById(values.id);
  if (!currentDepartment) throw new NotFoundError('Department not found');

  const editedDepartment = await edit({ ...values });

  return { department: editedDepartment };
});

export const deleteDepartment = action(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');

  await validateSession();

  const currentDepartment = await getById(id);
  if (!currentDepartment) throw new NotFoundError('Department not found');

  await deleteById(id);

  return json({ success: true }, { revalidate: [] });
});

export const getAllDepartment = query(async () => {
  'use server';
  const departments = await getAll();
  return { departments };
}, 'getAllDepartment');

export const getDepartmentById = query(async (id: string) => {
  'use server';
  const department = await getById(id);
  if (!department) throw new NotFoundError('Department does not exist');
  return { department };
}, 'getDepartmentById');
