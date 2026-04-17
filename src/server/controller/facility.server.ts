import { action, query } from '@solidjs/router';
import { add, deleteById, edit, getAll, getById } from '~/server/repository/facility.server';
import { getSession } from '~/lib/auth.server';

export const addFacility = action(async (values: { name: string; description?: string }) => {
  'use server';
  if (!values.name) {
    throw new Error('Name is required');
  }

  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) throw new Error('Unauthorized');

  const newFacility = await add({ ...values, createdBy: userId });

  return {
    status: 'success',
    data: {
      facility: newFacility,
    },
  };
});

export const editFacility = action(
  async (values: { id: string; name: string; description?: string }) => {
    'use server';
    if (!values.name) {
      throw new Error('Name is required');
    }

    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error('Unauthorized');

    const currentFacility = await getById(values.id);

    if (!currentFacility) {
      throw new Error('Facility not found');
    }

    if (currentFacility.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    const editedFacility = await edit({ ...values });

    return {
      status: 'success',
      data: {
        facility: editedFacility,
      },
    };
  },
);

export const deleteFacility = action(async (id: string) => {
  'use server';

  if (!id) throw new Error('Id is required');

  const session = await getSession();
  const userId = session.data.userId;

  if (!userId) throw new Error('Unauthorized');

  const currentFacility = await getById(id);

  if (!currentFacility) {
    throw new Error('Facility not found');
  }

  if (currentFacility.createdBy !== userId) {
    throw new Error('Unauthorized');
  }

  await deleteById(id);

  return {
    status: 'success',
  };
});

export const getAllFacility = query(async () => {
  'use server';
  const facilities = await getAll();
  return {
    status: 'success',
    data: {
      facilities,
    },
  };
}, 'getAllFacility');

export const getFacilityById = query(async (id: string) => {
  'use server';
  const facility = await getById(id);
  return {
    status: 'success',
    data: {
      facility,
    },
  };
}, 'getFacilityById');
