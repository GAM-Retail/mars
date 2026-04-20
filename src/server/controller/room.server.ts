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
import { action, query } from '@solidjs/router';
import { getAllFacility } from '~/server/controller/facility.server';
import { getSession } from '~/lib/auth.server';

export const addRoom = action(
  async (values: { name: string; location: string; capacity: number; description?: string }) => {
    'use server';
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error('Unauthorized');

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
  },
);

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

export const deleteRoom = action(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) throw new Error('Unauthorized');
  const currentRoom = await getById(id);

  if (!currentRoom) {
    throw new Error('Room not found');
  }

  if (currentRoom.createdBy !== userId) {
    throw new Error('Unauthorized');
  }

  await deleteById(id);

  return {
    status: 'success',
  };
});

export const editRoom = action(
  async (values: {
    id: string;
    name: string;
    location: string;
    capacity: number;
    description?: string;
  }) => {
    'use server';
    if (!values.name) {
      throw new Error('Name is required');
    }

    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error('Unauthorized');

    const currentRoom = await getById(values.id);

    if (!currentRoom) {
      throw new Error('Room not found');
    }

    if (currentRoom.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    const editedRoom = await edit(values);

    return {
      status: 'success',
      data: {
        room: editedRoom,
      },
    };
  },
);

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

export const addFacilityToRoomAction = action(async (roomId: string, facilityId: string) => {
  'use server';
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) throw new Error('Unauthorized');

  const room = await getById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  if (room.createdBy !== userId) {
    throw new Error('Unauthorized');
  }

  await addFacilityToRoom(roomId, facilityId);

  return {
    status: 'success',
  };
});

export const removeFacilityFromRoomAction = action(async (roomId: string, facilityId: string) => {
  'use server';
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) throw new Error('Unauthorized');

  const room = await getById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  if (room.createdBy !== userId) {
    throw new Error('Unauthorized');
  }

  await removeFacilityFromRoom(roomId, facilityId);

  return {
    status: 'success',
  };
});

export const addPersonInChargeAction = action(async (roomId: string, personInChargeId: string) => {
  'use server';
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) throw new Error('Unauthorized');

  const room = await getById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  if (room.createdBy !== userId) {
    throw new Error('Unauthorized');
  }

  await addPersonInCharge(roomId, personInChargeId);

  return {
    status: 'success',
  };
});

export const removePersonInChargeAction = action(
  async (roomId: string, personInChargeId: string) => {
    'use server';
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error('Unauthorized');

    const room = await getById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    await removePersonInCharge(roomId, personInChargeId);

    return {
      status: 'success',
    };
  },
);
