import { action, json, query } from '@solidjs/router';
import { add, deleteById, edit, getAll, getById } from '~/server/repository/division.server';
import { validateSession } from '~/server/lib';
import { NotFoundError } from '~/lib/error';

export const addDivision = action(async (values: { name: string }) => {
  'use server';
  if (!values.name) throw new Error('Name is required');

  await validateSession();

  const newDivision = await add({ ...values });

  return { division: newDivision };
});

export const editDivision = action(async (values: { id: string; name: string }) => {
  'use server';
  if (!values.name) throw new Error('Name is required');

  await validateSession();

  const currentDivision = await getById(values.id);
  if (!currentDivision) throw new NotFoundError('Division not found');

  const editedDivision = await edit({ ...values });

  return { division: editedDivision };
});

export const deleteDivision = action(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');

  await validateSession();

  const currentDivision = await getById(id);
  if (!currentDivision) throw new NotFoundError('Division not found');

  await deleteById(id);

  return json({ success: true }, { revalidate: [] });
});

export const getAllDivision = query(async () => {
  'use server';
  const divisions = await getAll();
  return { divisions };
}, 'getAllDivision');

export const getDivisionById = query(async (id: string) => {
  'use server';
  const division = await getById(id);
  if (!division) throw new NotFoundError('Division does not exist');
  return { division };
}, 'getDivisionById');
