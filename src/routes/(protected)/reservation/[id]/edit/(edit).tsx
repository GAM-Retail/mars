import {
  A,
  createAsync,
  RouteDefinition,
  useAction,
  useNavigate,
  useParams,
  revalidate,
} from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import { toast } from 'solid-sonner';
import { Show } from 'solid-js';
import {
  getReservationByIdController,
  updateReservationAction,
} from '~/server/controller/reservation.server';
import ReservationForm, {
  ReservationSchema,
} from '~/routes/(protected)/reservation/components/ReservationForm';
import { UserRole } from '~/types';
import * as v from 'valibot';
import { getRoomsByPersonInCharge } from '~/server/controller/room.server';
import usePrefillOrganizerData from '~/routes/(protected)/reservation/lib/usePrefillOrganizerData';

export const route = {
  info: {
    title: 'Edit Reservation',
    description: 'Edit Reservation',
    breadcrumb: {
      href: '/reservation/edit',
      label: 'Edit Reservation',
    },
    newButtonState: {
      label: 'New Reservation',
      href: '/reservation/new',
      role: [UserRole.ADMIN],
    },
    role: [UserRole.ADMIN],
  },
} satisfies RouteDefinition;

export default function EditReservation() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const rooms = createAsync(() => getRoomsByPersonInCharge());
  const reservation = createAsync(() => getReservationByIdController(params.id));
  const updateReservation = useAction(updateReservationAction);

  const { data: organizerData, onChange: handleNikChange, loading } = usePrefillOrganizerData();

  const onSubmit = async (data: v.InferInput<typeof ReservationSchema>) => {
    try {
      const result = await updateReservation({
        id: params.id,
        roomId: data.roomId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        organizerNik: data.organizerNik,
        organizerName: data.organizerName,
        organizerEmail: data.organizerEmail,
        organizerPhone: data.organizerPhone,
        organizerDivision: data.organizerDivision,
        organizerDepartment: data.organizerDepartment,
        agenda: data.agenda,
      });
      await revalidate('getAllReservationsForCalendar');
      toast('Reservation has been updated', {
        description: 'Reservation has been updated successfully.',
        action: {
          label: 'Detail',
          onClick: () => navigate(`/reservation/${result.reservation.id}`),
        },
      });
      navigate(`/reservation/${params.id}`);
    } catch (error) {
      toast('Failed to update reservation', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <Show when={rooms() && reservation()}>
      {(res) => {
        const r = res().reservation;
        const dateStr = r.startTime.toISOString().split('T')[0];
        const startTime = r.startTime.toTimeString().slice(0, 5);
        const endTime = r.endTime.toTimeString().slice(0, 5);

        const org = organizerData();

        return (
          <div class="max-w-2xl border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
            <span>
              <A href={`/reservation/${params.id}`} class="flex items-center gap-2 mb-4 w-fit">
                <ArrowLeft class="h-4 w-4" />
                Back
              </A>
              <h2 class="text-xl font-semibold">Edit reservation</h2>
            </span>
            <ReservationForm
              onSubmit={onSubmit}
              rooms={rooms()!}
              onNikChange={handleNikChange}
              nikLoading={loading()}
              initialValues={{
                roomId: r.room.id,
                date: dateStr,
                startTime,
                endTime,
                organizerNik: r.organizer.nik,
                organizerName: r.organizer.name ?? org?.organizerName,
                organizerEmail: r.organizer.email ?? org?.organizerEmail,
                organizerPhone: r.organizer.phone ?? org?.organizerPhone,
                organizerDivision: r.organizer.division ?? org?.organizerDivision,
                organizerDepartment: r.organizer.department ?? org?.organizerDepartment,
                agenda: r.agenda || undefined,
              }}
            />
          </div>
        );
      }}
    </Show>
  );
}
