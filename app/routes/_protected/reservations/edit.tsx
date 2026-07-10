import { useLoaderData, redirect, Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePrefillOrganizerData } from '~/hooks/usePrefillOrganizerData';
import ReservationForm from '~/routes/_protected/reservations/components/ReservationForm';

import { getReservationById, updateReservationAction } from '~/lib/services/reservation.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { getAllRoomsData, getRoomsByPersonInChargeQuery } from '~/lib/services/room.server';
import { getOrganizationData } from '~/lib/services/division.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  const user = await getCurrentUser(request);
  const [reservationResult, rooms, orgData] = await Promise.all([
    getReservationById(params.id),
    user.role === 'SUPERADMIN' ? getAllRoomsData() : getRoomsByPersonInChargeQuery(user.id),
    getOrganizationData(),
  ]);
  if (!reservationResult) throw new Error('Reservation does not exist');
  const dateStr = new Date(reservationResult.startTime).toISOString().split('T')[0];
  const startTime = new Date(reservationResult.startTime).toTimeString().slice(0, 5);
  const endTime = new Date(reservationResult.endTime).toTimeString().slice(0, 5);

  return {
    reservation: reservationResult,
    rooms,
    ...orgData,
    initialValues: {
      room: reservationResult.room,
      date: dateStr,
      startTime,
      endTime,
      organizerNik: reservationResult.organizer.nik,
      organizerName: reservationResult.organizer.name,
      organizerEmail: reservationResult.organizer.email,
      organizerPhone: reservationResult.organizer.phone,
      organizerDivision: reservationResult.organizer.division?.id ?? '',
      organizerDepartment: reservationResult.organizer.department?.id ?? '',
      agenda: reservationResult.agenda || '',
    },
  };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const formData = await request.formData();
  try {
    const result = await updateReservationAction(request, {
      id: params.id,
      roomId: formData.get('roomId') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      organizerNik: formData.get('organizerNik') as string,
      organizerName: formData.get('organizerName') as string,
      organizerEmail: formData.get('organizerEmail') as string,
      organizerPhone: formData.get('organizerPhone') as string,
      organizerDivision: (formData.get('organizerDivision') as string) || undefined,
      organizerDepartment: (formData.get('organizerDepartment') as string) || undefined,
      agenda: (formData.get('agenda') as string) || undefined,
    });
    return redirect(`/reservations/${result.reservation.id}`);
  } catch (err) {
    return catchResult(err);
  }
}

export default function EditReservation() {
  const params = useParams();
  const { rooms, divisions, departmentsByDivision, initialValues } = useLoaderData<typeof loader>();
  const {
    data: organizerData,
    onChange: handleNikChange,
    loading: nikLoading,
  } = usePrefillOrganizerData();

  const mergedValues = organizerData ? { ...initialValues, ...organizerData } : initialValues;

  return (
    <div className="max-w-2xl border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col">
      <span>
        <Link to={`/reservations/${params.id}`} className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Edit reservation</h2>
      </span>
      <ReservationForm
        rooms={rooms}
        divisions={divisions}
        departmentsByDivision={departmentsByDivision}
        onNikChange={handleNikChange}
        nikLoading={nikLoading}
        initialValues={mergedValues}
      />
    </div>
  );
}
