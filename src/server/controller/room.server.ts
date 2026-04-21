import {
  add,
  addFacilityToRoom,
  addPersonInCharge,
  deleteById,
  edit,
  getAll,
  getById,
  removeFacilityFromRoom,
  removePersonInCharge,
} from '~/server/repository/room.server';
import { action, CustomResponse, json, query } from '@solidjs/router';
import { getAllFacility } from '~/server/controller/facility.server';
import { validateSession } from '~/server/lib';
import ActionResponse from '~/server/types/actionResponse';
import { Room } from '~/generated/prisma/client';

export const addRoom = action<
  Array<{ name: string; location: string; capacity: number; description?: string }>,
  ActionResponse<{ room: Room }>
>(async (values) => {
  'use server';
  try {
    const userId = await validateSession();

    const newRoom = await add({
      ...values,
      createdBy: userId,
    });

    return {
      status: 'success',
      data: {
        room: newRoom,
      },
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const getAllRooms = query(async () => {
  'use server';

  const rooms = await getAll();
  return {
    status: 'success',
    data: {
      rooms,
    },
  };
}, 'getAllRooms');

export const getRoomById = query(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');
  const room = await getById(id);
  return {
    status: 'success',
    data: {
      room,
    },
  };
}, 'getRoomById');

export const deleteRoom = action<
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

    const currentRoom = await getById(id);

    if (!currentRoom) {
      return {
        status: 'error',
        message: 'Room does not exist',
      };
    }

    if (currentRoom.createdBy !== userId) {
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

export const editRoom = action<
  Array<{
    id: string;
    name: string;
    location: string;
    capacity: number;
    description?: string;
  }>,
  ActionResponse<{ room: Room }>
>(async (values) => {
  'use server';
  try {
    if (!values.name) {
      return {
        status: 'error',
        message: 'Id is required',
      };
    }

    const userId = await validateSession();

    const currentRoom = await getById(values.id);

    if (!currentRoom) {
      return {
        status: 'error',
        message: 'Room does not exist',
      };
    }

    if (currentRoom.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    const editedRoom = await edit(values);

    return {
      status: 'success',
      data: {
        room: editedRoom,
      },
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const getAllFacilitiesForRoom = query(async () => {
  'use server';
  const result = await getAllFacility();
  return {
    status: 'success',
    data: {
      facilities: result.data.facilities,
    },
  };
}, 'getAllFacilitiesForRoom');

export const addFacilityToRoomAction = action<
  Array<string>,
  { status: 'success' } | { status: 'error'; message: string }
>(async (roomId: string, facilityId: string) => {
  'use server';
  try {
    const userId = await validateSession();

    const room = await getById(roomId);
    if (!room) {
      return {
        status: 'error',
        message: 'Room does not exist',
      };
    }

    if (room.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    await addFacilityToRoom(roomId, facilityId);

    return {
      status: 'success',
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const removeFacilityFromRoomAction = action<
  Array<string>,
  { status: 'success' } | { status: 'error'; message: string }
>(async (roomId: string, facilityId: string) => {
  'use server';
  try {
    const userId = await validateSession();

    const room = await getById(roomId);
    if (!room) {
      return {
        status: 'error',
        message: 'Room does not exist',
      };
    }

    if (room.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    await removeFacilityFromRoom(roomId, facilityId);

    return {
      status: 'success',
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const addPersonInChargeAction = action<
  Array<string>,
  { status: 'success' } | { status: 'error'; message: string }
>(async (roomId: string, personInChargeId: string) => {
  'use server';
  try {
    const userId = await validateSession();

    const room = await getById(roomId);
    if (!room) {
      return {
        status: 'error',
        message: 'Room does not exist',
      };
    }

    if (room.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    await addPersonInCharge(roomId, personInChargeId);

    return {
      status: 'success',
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});

export const removePersonInChargeAction = action<
  Array<string>,
  { status: 'success' } | { status: 'error'; message: string }
>(async (roomId: string, personInChargeId: string) => {
  'use server';
  try {
    const userId = await validateSession();

    const room = await getById(roomId);
    if (!room) {
      return {
        status: 'error',
        message: 'Room does not exist',
      };
    }

    if (room.createdBy !== userId) {
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    await removePersonInCharge(roomId, personInChargeId);

    return {
      status: 'success',
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
});
