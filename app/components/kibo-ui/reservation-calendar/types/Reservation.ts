import type { Room, RoomReservation } from '~/generated/prisma/client';
import type { OrganizerGetPayload } from '~/generated/prisma/models/Organizer';
import type { UserGetPayload } from '~/generated/prisma/models/User';

export type ReservationRoom = Room;

export type ReservationUser = UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    nik: true;
    department: true;
    division: true;
    ext: true;
  };
}>;

export type ReservationOrganizer = OrganizerGetPayload<{
  include: { department: true; division: true };
}>;

export type Reservation = RoomReservation & {
  room: ReservationRoom;
  reservedBy: ReservationUser;
  organizer: ReservationOrganizer;
};
