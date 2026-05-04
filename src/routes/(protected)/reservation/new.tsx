import { A, RouteDefinition, useAction, useNavigate, createAsync } from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import { toast } from 'solid-sonner';
import { createReservationAction } from '~/server/controller/reservation.server';
import ReservationForm, {
  ReservationSchema,
} from '~/routes/(protected)/reservation/components/ReservationForm';
import { UserRole } from '~/types';
import * as v from 'valibot';
import { Show } from 'solid-js';
import { getRoomsByPersonInCharge } from '~/server/controller/room.server';
import usePrefillOrganizerData from '~/routes/(protected)/reservation/lib/usePrefillOrganizerData';

export const route = {
  info: {
    title: 'New Reservation',
    description: 'Create new Reservation',
    breadcrumb: {
      href: '/reservation/new',
      label: 'Create Reservation',
    },
    newButtonState: {
      label: 'New Reservation',
      href: '/reservation/new',
      role: [UserRole.ADMIN],
    },
    role: [UserRole.ADMIN],
  },
} satisfies RouteDefinition;

export default function NewReservation() {
  const navigate = useNavigate();
  const rooms = createAsync(() => getRoomsByPersonInCharge());
  const createReservation = useAction(createReservationAction);
  const { data: organizerData, onChange: handleNikChange, loading } = usePrefillOrganizerData();
  const onSubmit = async (data: v.InferInput<typeof ReservationSchema>) => {
    try {
      const result = await createReservation({
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
      toast('Reservation has been created', {
        description: 'Room reservation has been created successfully.',
        action: {
          label: 'View',
          onClick: () => navigate(`/reservation/${result.reservation.id}`),
        },
      });
      navigate('/reservation');
    } catch (error) {
      toast('Failed to create reservation', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <Show when={rooms()}>
      <div class="max-w-2xl border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href="/reservation" class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <h2 class="text-xl font-semibold">Create new reservation</h2>
        </span>
        <Show
          when={organizerData()}
          fallback={
            <ReservationForm
              onSubmit={onSubmit}
              rooms={rooms()!}
              onNikChange={handleNikChange}
              nikLoading={loading()}
            />
          }
        >
          {(orgData) => {
            return (
              <ReservationForm
                onSubmit={onSubmit}
                rooms={rooms()!}
                onNikChange={handleNikChange}
                nikLoading={loading()}
                initialValues={{
                  organizerNik: organizerData()?.organizerNik || '',
                  organizerName: orgData().organizerName,
                  organizerEmail: orgData().organizerEmail,
                  organizerPhone: orgData().organizerPhone,
                  organizerDivision: orgData().organizerDivision,
                  organizerDepartment: orgData().organizerDepartment,
                }}
              />
            );
          }}
        </Show>
      </div>
    </Show>
  );
}
