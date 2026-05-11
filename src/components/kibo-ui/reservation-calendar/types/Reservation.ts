import type { Organizer, Room, RoomReservation, User } from '~/generated/prisma/client';

export type ReservationRoom = Room;

export type ReservationUser = Omit<User, 'password'>;

export type ReservationOrganizer = Organizer;

export type Reservation = RoomReservation & {
  room: ReservationRoom;
  reservedBy: ReservationUser;
  organizer: ReservationOrganizer;
};
