import db from '~/lib/db';
import { getUserById } from '~/lib/services/user.server';
import { getAllFacility } from '~/lib/services/facility.server';
import { validateSession, validateSessionWithRole } from '~/lib/session.server';

import type { CreateRoomDTO, UpdateRoomDTO } from '~/lib/services/types';

export async function getRoomByIdRaw(id: string) {
  return db.room.findUnique({
    where: { id },
    include: {
      createdByUser: true,
      roomFacilities: {
        include: { facility: true },
      },
      roomPersonInCharges: {
        include: { personInCharge: true },
      },
    },
  });
}

export async function getAllRoomsData() {
  return db.room.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createRoom(data: CreateRoomDTO) {
  return db.room.create({
    data: {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      description: data.description ?? '',
      createdBy: data.createdBy,
    },
  });
}

export async function updateRoom(data: UpdateRoomDTO) {
  return db.room.update({
    data: {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      description: data.description ?? '',
    },
    where: { id: data.id },
  });
}

export async function deleteRoomById(id: string) {
  return db.room.delete({ where: { id } });
}

export async function addFacilityToRoom(roomId: string, facilityId: string) {
  const existing = await db.roomFacility.findFirst({ where: { roomId, facilityId } });
  if (existing) throw new Error('Facility already added to this room');
  return db.roomFacility.create({ data: { roomId, facilityId } });
}

export async function removeFacilityFromRoom(roomId: string, facilityId: string) {
  const existing = await db.roomFacility.findFirst({ where: { roomId, facilityId } });
  if (existing) return db.roomFacility.delete({ where: { id: existing.id } });
  return null;
}

export async function addPersonInCharge(roomId: string, personInChargeId: string) {
  const existing = await db.roomPersonInCharge.findFirst({ where: { roomId, personInChargeId } });
  if (existing) throw new Error('Person already added to this room');
  return db.roomPersonInCharge.create({ data: { roomId, personInChargeId } });
}

export async function removePersonInCharge(roomId: string, personInChargeId: string) {
  const existing = await db.roomPersonInCharge.findFirst({ where: { roomId, personInChargeId } });
  if (existing) return db.roomPersonInCharge.delete({ where: { id: existing.id } });
  return null;
}

export async function isPersonInCharge(userId: string, roomId: string) {
  const pic = await db.roomPersonInCharge.findFirst({
    where: { roomId, personInChargeId: userId },
  });
  return !!pic;
}

export async function getRoomsByPersonInChargeQuery(userId: string) {
  return db.room.findMany({
    where: {
      roomPersonInCharges: { some: { personInChargeId: userId } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addRoom(
  request: Request,
  values: { name: string; location: string; capacity: number; description?: string },
) {
  const userId = await validateSession(request);
  const newRoom = await createRoom({ ...values, createdBy: userId });
  return { room: newRoom };
}

export async function getAllRooms() {
  const rooms = await getAllRoomsData();
  return { rooms };
}

export async function getRoomById(id: string) {
  if (!id) throw new Error('Id is required');
  const room = await getRoomByIdRaw(id);
  if (!room) throw new Error('Room does not exist');
  return { room };
}

export async function deleteRoom(request: Request, id: string) {
  if (!id) throw new Error('Id is required');
  const userId = await validateSession(request);
  const currentRoom = await getRoomByIdRaw(id);
  if (!currentRoom) throw new Error('Room does not exist');
  if (currentRoom.createdBy !== userId)
    throw new Error('FORBIDDEN: Cannot delete room created by another user.');
  await deleteRoomById(id);
  return { success: true };
}

export async function editRoom(
  request: Request,
  values: { id: string; name: string; location: string; capacity: number; description?: string },
) {
  if (!values.name) throw new Error('Name is required');
  const userId = await validateSession(request);
  const currentRoom = await getRoomByIdRaw(values.id);
  if (!currentRoom) throw new Error('Room does not exist');
  if (currentRoom.createdBy !== userId)
    throw new Error('FORBIDDEN: Cannot edit room created by another user.');
  const editedRoom = await updateRoom(values);
  return { room: editedRoom };
}

export async function getAllFacilitiesForRoom() {
  return getAllFacility();
}

export async function addFacilityToRoomAction(
  request: Request,
  roomId: string,
  facilityId: string,
) {
  const isSuperAdmin = await validateSessionWithRole('SUPERADMIN', request);
  const room = await getRoomByIdRaw(roomId);
  if (!room) throw new Error('Room does not exist');
  if (!isSuperAdmin) throw new Error('FORBIDDEN: Cannot add facility to room.');
  await addFacilityToRoom(roomId, facilityId);
  return { success: true };
}

export async function removeFacilityFromRoomAction(
  request: Request,
  roomId: string,
  facilityId: string,
) {
  const isSuperAdmin = await validateSessionWithRole('SUPERADMIN', request);
  const room = await getRoomByIdRaw(roomId);
  if (!room) throw new Error('Room does not exist');
  if (!isSuperAdmin) throw new Error('FORBIDDEN: Cannot remove facility from room.');
  await removeFacilityFromRoom(roomId, facilityId);
  return { success: true };
}

export async function getRoomsByPersonInCharge(request: Request) {
  const userId = await validateSession(request);
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  if (user.role === 'SUPERADMIN') return getAllRoomsData();
  return getRoomsByPersonInChargeQuery(userId);
}

export function validateRoomPersonInCharge(userId: string, roomId: string) {
  return isPersonInCharge(userId, roomId);
}

export async function addPersonInChargeAction(
  request: Request,
  roomId: string,
  personInChargeId: string,
) {
  const userId = await validateSession(request);
  const isSuperAdmin = await validateSessionWithRole('SUPERADMIN', request);
  const room = await getRoomByIdRaw(roomId);
  if (!room) throw new Error('Room does not exist');
  if (room.createdBy !== userId && !isSuperAdmin)
    throw new Error('FORBIDDEN: Cannot add person in charge.');
  await addPersonInCharge(roomId, personInChargeId);
  return { success: true };
}

export async function removePersonInChargeAction(
  request: Request,
  roomId: string,
  personInChargeId: string,
) {
  const isSuperAdmin = await validateSessionWithRole('SUPERADMIN', request);
  const room = await getRoomByIdRaw(roomId);
  if (!room) throw new Error('Room does not exist');
  if (!isSuperAdmin) throw new Error('FORBIDDEN: Cannot remove person in charge');
  await removePersonInCharge(roomId, personInChargeId);
  return { success: true };
}
