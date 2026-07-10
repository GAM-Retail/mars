import db from '~/lib/db';
import { validateSession } from '~/lib/session.server';

import type { CreateFacilityDTO, UpdateFacilityDTO } from '~/lib/services/types';

export async function createFacility(data: CreateFacilityDTO) {
  return db.facility.create({
    data: {
      name: data.name,
      description: data.description ?? '',
      createdBy: data.createdBy,
    },
  });
}

export async function updateFacility(data: UpdateFacilityDTO) {
  return db.facility.update({
    data: { name: data.name, description: data.description ?? '' },
    where: { id: data.id },
  });
}

export async function getAllFacilities() {
  return db.facility.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getFacilityByIdRaw(id: string) {
  return db.facility.findUnique({ where: { id }, include: { createdByUser: true } });
}

export async function deleteFacilityById(id: string) {
  return db.facility.delete({ where: { id } });
}

export async function getRoomsByFacilityIdRaw(facilityId: string) {
  return db.roomFacility.findMany({
    where: { facilityId },
    include: {
      room: {
        include: {
          createdByUser: true,
          roomFacilities: { include: { facility: true } },
        },
      },
    },
  });
}

export async function addFacility(
  request: Request,
  values: { name: string; description?: string },
) {
  if (!values.name) throw new Error('Name is required');
  const userId = await validateSession(request);
  const newFacility = await createFacility({ ...values, createdBy: userId });
  return { facility: newFacility };
}

export async function editFacility(
  request: Request,
  values: { id: string; name: string; description?: string },
) {
  if (!values.name) throw new Error('Name is required');
  const userId = await validateSession(request);
  const currentFacility = await getFacilityByIdRaw(values.id);
  if (!currentFacility) throw new Error('Facility not found');
  if (currentFacility.createdBy !== userId)
    throw new Error('Cannot edit facility created by another user');
  const editedFacility = await updateFacility(values);
  return { facility: editedFacility };
}

export async function deleteFacility(request: Request, id: string) {
  if (!id) throw new Error('Id is required');
  const userId = await validateSession(request);
  const currentFacility = await getFacilityByIdRaw(id);
  if (!currentFacility) throw new Error('Facility not found');
  if (currentFacility.createdBy !== userId)
    throw new Error('Cannot delete facility created by another user');
  await deleteFacilityById(id);
  return { success: true };
}

export async function getAllFacility() {
  const facilities = await getAllFacilities();
  return { facilities };
}

export async function getFacilityById(id: string) {
  const facility = await getFacilityByIdRaw(id);
  if (!facility) throw new Error('Facility does not exist');
  return { facility };
}

export async function getRoomsByFacilityId(id: string) {
  const roomFacilities = await getRoomsByFacilityIdRaw(id);
  return { roomFacilities };
}
