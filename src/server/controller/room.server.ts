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
import { action, json, query } from '@solidjs/router';
import { getAllFacility } from '~/server/controller/facility.server';
import { validateSession } from '~/server/lib';
import { ForbiddenError, NotFoundError } from '~/lib/error';

export const addRoom = action(
  async (values: { name: string; location: string; capacity: number; description?: string }) => {
    'use server';
    const userId = await validateSession();

    const newRoom = await add({
      ...values,
      createdBy: userId,
    });

    return { room: newRoom };
  },
);

export const getAllRooms = query(async () => {
  'use server';
  const rooms = await getAll();
  return { rooms };
}, 'getAllRooms');

export const getRoomById = query(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');
  const room = await getById(id);
  if (!room) throw new NotFoundError('Room does not exist');
  return { room };
}, 'getRoomById');

export const deleteRoom = action(async (id: string) => {
  'use server';
  if (!id) throw new Error('Id is required');
  const userId = await validateSession();

  const currentRoom = await getById(id);
  if (!currentRoom) throw new NotFoundError('Room does not exist');
  if (currentRoom.createdBy !== userId) throw new ForbiddenError();

  await deleteById(id);

  return json({ success: true }, { revalidate: [] });
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
    if (!values.name) throw new Error('Name is required');

    const userId = await validateSession();

    const currentRoom = await getById(values.id);
    if (!currentRoom) throw new NotFoundError('Room does not exist');
    if (currentRoom.createdBy !== userId) throw new ForbiddenError();

    const editedRoom = await edit(values);

    return { room: editedRoom };
  },
);

export const getAllFacilitiesForRoom = query(async () => {
  'use server';
  return getAllFacility();
}, 'getAllFacilitiesForRoom');

export const addFacilityToRoomAction = action(async (roomId: string, facilityId: string) => {
  'use server';
  const userId = await validateSession();

  const room = await getById(roomId);
  if (!room) throw new NotFoundError('Room does not exist');
  if (room.createdBy !== userId) throw new ForbiddenError();

  await addFacilityToRoom(roomId, facilityId);

  return { success: true };
});

export const removeFacilityFromRoomAction = action(async (roomId: string, facilityId: string) => {
  'use server';
  const userId = await validateSession();

  const room = await getById(roomId);
  if (!room) throw new NotFoundError('Room does not exist');
  if (room.createdBy !== userId) throw new ForbiddenError();

  await removeFacilityFromRoom(roomId, facilityId);

  return { success: true };
});

export const addPersonInChargeAction = action(async (roomId: string, personInChargeId: string) => {
  'use server';
  const userId = await validateSession();

  const room = await getById(roomId);
  if (!room) throw new NotFoundError('Room does not exist');
  if (room.createdBy !== userId) throw new ForbiddenError();

  await addPersonInCharge(roomId, personInChargeId);

  return { success: true };
});

export const removePersonInChargeAction = action(
  async (roomId: string, personInChargeId: string) => {
    'use server';
    const userId = await validateSession();

    const room = await getById(roomId);
    if (!room) throw new NotFoundError('Room does not exist');
    if (room.createdBy !== userId) throw new ForbiddenError();

    await removePersonInCharge(roomId, personInChargeId);

    return { success: true };
  },
);
