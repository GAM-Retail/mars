export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateDepartmentDTO {
  name: string;
}

export interface UpdateDepartmentDTO {
  id: string;
  name: string;
}

export interface DepartmentDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDivisionDTO {
  name: string;
}

export interface UpdateDivisionDTO {
  id: string;
  name: string;
}

export interface DivisionDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFacilityDTO {
  name: string;
  description?: string;
  createdBy: string;
}

export interface UpdateFacilityDTO {
  id: string;
  name: string;
  description?: string;
}

export interface FacilityDTO {
  id: string;
  name: string;
  description: string;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizerDTO {
  nik: string;
  name: string;
  email: string;
  phone: string;
  departmentId?: string;
  divisionId?: string;
}

export interface UpdateOrganizerDTO {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
  departmentId?: string;
  divisionId?: string;
}

export interface CreateRoomDTO {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  createdBy: string;
}

export interface UpdateRoomDTO {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description?: string;
}

export interface CreateReservationDTO {
  roomId: string;
  reservedById: string;
  organizerId: string;
  startTime: Date;
  endTime: Date;
  agenda?: string;
}

export interface UpdateReservationDTO {
  id: string;
  roomId: string;
  reservedById: string;
  organizerId: string;
  startTime: Date;
  endTime: Date;
  agenda?: string;
}

export interface CreateUserDTO {
  nik: string;
  email: string;
  name: string;
  password: string;
  role: 'SUPERADMIN' | 'ADMIN';
  ext?: string;
  divisionId?: string;
  departmentId?: string;
}

export interface UpdateUserDTO {
  id: string;
  nik: string;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'ADMIN';
  password?: string;
  ext?: string;
  divisionId?: string;
  departmentId?: string;
}
