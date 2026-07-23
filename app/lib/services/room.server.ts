import db from '~/lib/db';
import { getAllFacility } from '~/lib/services/facility.server';

import type { CreateRoomDTO, UpdateRoomDTO } from '~/lib/services/types';
import { CurrentUser } from '~/lib/current-user.server';

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

export async function isPersonInCharge(user: CurrentUser, roomId: string) {
  const pic = await db.roomPersonInCharge.findFirst({
    where: {
      roomId,
      OR: [{ personInChargeId: user.id }, { personInCharge: { departmentId: user.departmentId } }],
    },
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

export async function getAllFacilitiesForRoom() {
  return getAllFacility();
}
