import { action, CustomResponse, json, query } from '@solidjs/router';
import {
  add,
  deleteById,
  edit,
  getAll,
  getById,
  getRoomsByFacilityId as getRoomsByFacilityIdRepo,
} from '~/server/repository/facility.server';
import { validateSession } from '~/server/lib';
import { Facility } from '~/generated/prisma/client';
import ActionResponse from '~/server/types/actionResponse';

export const addFacility = action<
  Array<{ name: string; description?: string }>,
  ActionResponse<{ facility: Facility }>
>(async (values) => {
  'use server';
  try {
    if (!values.name) {
      return {
        status: 'error',
        message: 'Name is required',
      };
    }

    const userId = await validateSession();

    const newFacility = await add({ ...values, createdBy: userId });

    return {
      status: 'success',
      data: {
        facility: newFacility,
      },
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const editFacility = action<
  Array<{ id: string; name: string; description?: string }>,
  ActionResponse<{ facility: Facility }>
>(async (values) => {
  'use server';
  try {
    if (!values.name) {
      return {
        status: 'error',
        message: 'Name is required',
      };
    }

    const userId = await validateSession();

    const currentFacility = await getById(values.id);

    if (!currentFacility) {
      return {
        status: 'error',
        message: 'Facility not found',
      };
    }

    if (currentFacility.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    const editedFacility = await edit({ ...values });

    return {
      status: 'success',
      data: {
        facility: editedFacility,
      },
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const deleteFacility = action<
  Array<string>,
  CustomResponse<{ status: 'success' }> | { status: 'error'; message: string }
>(async (id: string) => {
  'use server';

  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Id is required',
      };
    }

    const userId = await validateSession();

    const currentFacility = await getById(id);

    if (!currentFacility) {
      return {
        status: 'error',
        message: 'Facility not found',
      };
    }

    if (currentFacility.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    await deleteById(id);

    return json({ status: 'success' }, { revalidate: [] });
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
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

export const getRoomsByFacilityId = query(async (id: string) => {
  'use server';
  const roomFacilities = await getRoomsByFacilityIdRepo(id);
  return {
    status: 'success',
    data: {
      roomFacilities,
    },
  };
}, 'getRoomsByFacilityId');
