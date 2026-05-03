export type ReservationRoom = {
  id: string;
  name: string;
  location: string;
  capacity: number;
};

export type ReservationUser = {
  id: string;
  name: string;
  nik: string;
  email: string;
  department?: string | null;
  division?: string | null;
};

export type ReservationOrganizer = {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
  department?: string | null;
  division?: string | null;
};

export type Reservation = {
  id: string;
  roomId: string;
  room: ReservationRoom;
  reservedById: string;
  reservedBy: ReservationUser;
  organizerId: string;
  organizer: ReservationOrganizer;
  startTime: Date;
  endTime: Date;
  agenda?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
