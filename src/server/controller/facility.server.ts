import { action, json, query } from '@solidjs/router';
import {
  add,
  deleteById,
  edit,
  getAll,
  getById,
  getRoomsByFacilityId as getRoomsByFacilityIdRepo,
} from '~/server/repository/facility.server';
import { validateSession } from '~/server/lib';
import { ForbiddenError, NotFoundError } from '~/lib/error';

export const addFacility = action(async (values: { name: string; description?: string }) => {
  'use server';
  if (!values.name) throw new Error('Name is required');

  const userId = await validateSession();

  const newFacility = await add({ ...values, createdBy: userId });

  return { facility: newFacility };
});

export const editFacility = action(
  async (values: { id: string; name: string; description?: string }) => {
    'use server';
    if (!values.name) throw new Error('Name is required');

    const userId = await validateSession();

    const currentFacility = await getById(values.id);
    if (!currentFacility) throw new NotFoundError('Facility not found');
    if (currentFacility.createdBy !== userId) throw new ForbiddenError();

    const editedFacility = await edit({ ...values });

    return { facility: editedFacility };
  },
);

export const deleteFacility = action(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');

  const userId = await validateSession();

  const currentFacility = await getById(id);
  if (!currentFacility) throw new NotFoundError('Facility not found');
  if (currentFacility.createdBy !== userId) throw new ForbiddenError();

  await deleteById(id);

  return json({ success: true }, { revalidate: [] });
});

export const getAllFacility = query(async () => {
  'use server';
  const facilities = await getAll();
  return { facilities };
}, 'getAllFacility');

export const getFacilityById = query(async (id: string) => {
  'use server';
  const facility = await getById(id);
  if (!facility) throw new NotFoundError('Facility does not exist');
  return { facility };
}, 'getFacilityById');

export const getRoomsByFacilityId = query(async (id: string) => {
  'use server';
  const roomFacilities = await getRoomsByFacilityIdRepo(id);
  return { roomFacilities };
}, 'getRoomsByFacilityId');
