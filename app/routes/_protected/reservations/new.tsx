import { useLoaderData, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePrefillOrganizerData } from '~/hooks/usePrefillOrganizerData';
import ReservationForm from '~/routes/_protected/reservations/components/ReservationForm';

import { getCurrentUser } from '~/lib/current-user.server';
import { getAllRoomsData, getRoomsByPersonInChargeQuery } from '~/lib/services/room.server';
import { createReservationAction } from '~/lib/services/reservation.server';
import { catchResult } from '~/lib/error/response.server';
import { getOrganizationData } from '~/lib/services/division.server';
import { redirectWithToast } from '~/lib/utils.server';

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const [rooms, orgData] = await Promise.all([
    user.role === 'SUPERADMIN' ? getAllRoomsData() : getRoomsByPersonInChargeQuery(user.id),
    getOrganizationData(),
  ]);
  return { rooms, ...orgData };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  try {
    const result = await createReservationAction(request, {
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
    return redirectWithToast(request, `/reservations/${result.reservation.id}`, {
      type: 'success',
      title: 'Reservation created',
      description: 'Reservation created successfully.',
    });
  } catch (err) {
    return catchResult(request, err);
  }
}

export default function NewReservation() {
  const { rooms, divisions, departmentsByDivision } = useLoaderData<typeof loader>();
  const {
    data: organizerData,
    onChange: handleNikChange,
    loading: nikLoading,
  } = usePrefillOrganizerData();

  const initialValues = organizerData
    ? {
        organizerNik: organizerData.organizerNik,
        organizerName: organizerData.organizerName,
        organizerEmail: organizerData.organizerEmail,
        organizerPhone: organizerData.organizerPhone,
        organizerDivision: organizerData.organizerDivision,
        organizerDepartment: organizerData.organizerDepartment,
      }
    : undefined;

  return (
    <div className="max-w-2xl border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
      <span>
        <Link to="/reservation" className="flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold">Create new reservation</h2>
      </span>
      <ReservationForm
        rooms={rooms}
        divisions={divisions}
        departmentsByDivision={departmentsByDivision}
        onNikChange={handleNikChange}
        nikLoading={nikLoading}
        initialValues={initialValues}
      />
    </div>
  );
}
