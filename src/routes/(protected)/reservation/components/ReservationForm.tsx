import * as v from 'valibot';
import { createForm, type DeepPartial, Field, Form, getInput } from '@formisch/solid';
import { Calendar, Clock, LoaderCircle } from 'lucide-solid';
import { Show, createEffect, on } from 'solid-js';
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';

export const ReservationSchema = v.object({
  roomId: v.pipe(v.string('Please select a room'), v.nonEmpty('Please select a room')),
  date: v.pipe(v.string('Please select a date'), v.nonEmpty('Please select a date')),
  startTime: v.pipe(v.string('Please select start time'), v.nonEmpty('Please select start time')),
  endTime: v.pipe(v.string('Please select end time'), v.nonEmpty('Please select end time')),
  organizerNik: v.pipe(
    v.string('Please enter organizer NIK'),
    v.nonEmpty('Please enter organizer NIK'),
    v.length(6, 'NIK must be 6 digits'),
  ),
  organizerName: v.pipe(
    v.string('Please enter organizer name'),
    v.nonEmpty('Please enter organizer name'),
  ),
  organizerEmail: v.pipe(
    v.string('Please enter organizer email'),
    v.nonEmpty('Please enter organizer email'),
    v.email('Please enter a valid email'),
  ),
  organizerPhone: v.pipe(
    v.string('Please enter organizer phone'),
    v.startsWith('08', 'Phone number must start with 08'),
    v.minLength(10, 'Phone number must be at least 10 digits'),
    v.maxLength(13, 'Phone number must be at most 13 digits'),
    v.nonEmpty('Please enter organizer phone'),
  ),
  organizerDivision: v.optional(v.string()),
  organizerDepartment: v.optional(v.string()),
  agenda: v.optional(v.string()),
});

type ReservationFormProps = {
  onSubmit: (data: v.InferInput<typeof ReservationSchema>) => void;
  initialValues?: DeepPartial<v.InferInput<typeof ReservationSchema>>;
  rooms: { id: string; name: string; location: string }[];
  onNikChange?: (nik: string) => void;
  nikLoading?: boolean;
};

const today = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export default function ReservationForm(props: Readonly<ReservationFormProps>) {
  const reservationForm = createForm({
    schema: ReservationSchema,
    initialInput: props.initialValues,
  });

  createEffect(
    on(
      () => getInput(reservationForm, { path: ['organizerNik'] }),
      (nik: unknown) => {
        if (!nik || (nik as string).length !== 6) return;
        props.onNikChange?.(nik as string);
      },
    ),
  );

  return (
    <Form
      method="post"
      of={reservationForm}
      onSubmit={(data, e) => {
        e?.preventDefault();
        props.onSubmit(data);
      }}
      class="flex flex-col gap-4"
    >
      <div class="border-b pb-2 mb-2">
        <h3 class="text-sm font-medium text-muted-foreground">Organizer Details</h3>
      </div>

      <Field of={reservationForm} path={['organizerNik']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>NIK</TextFieldLabel>
            <div class="relative">
              <TextFieldInput placeholder="6 digit NIK" maxLength={6} name="organizerNik" />
              <Show when={props.nikLoading}>
                <LoaderCircle class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              </Show>
            </div>
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <Field of={reservationForm} path={['organizerName']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Name</TextFieldLabel>
            <TextFieldInput />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <Field of={reservationForm} path={['organizerEmail']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Email</TextFieldLabel>
            <TextFieldInput type="email" />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <Field of={reservationForm} path={['organizerPhone']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Phone</TextFieldLabel>
            <TextFieldInput placeholder="e.g. 081234567890" />
            <TextFieldDescription>
              This phone number will be used for notifications and contact purposes.
            </TextFieldDescription>
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <div class="grid grid-cols-2 gap-4">
        <Field of={reservationForm} path={['organizerDivision']}>
          {(field) => (
            <TextField
              name={field.props.name}
              validationState={field?.errors?.length ? 'invalid' : 'valid'}
              value={field.input}
              onChange={field.onInput}
            >
              <TextFieldLabel>Division</TextFieldLabel>
              <TextFieldInput />
              <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
            </TextField>
          )}
        </Field>

        <Field of={reservationForm} path={['organizerDepartment']}>
          {(field) => (
            <TextField
              name={field.props.name}
              validationState={field?.errors?.length ? 'invalid' : 'valid'}
              value={field.input}
              onChange={field.onInput}
            >
              <TextFieldLabel>Department</TextFieldLabel>
              <TextFieldInput />
              <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
            </TextField>
          )}
        </Field>
      </div>

      <div class="border-b pb-2 mb-2 mt-4">
        <h3 class="text-sm font-medium text-muted-foreground">Room & Time</h3>
      </div>

      <Field of={reservationForm} path={['roomId']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Room</TextFieldLabel>
            <Select
              value={field.input}
              onChange={(value) => value && field.onInput(value)}
              options={props.rooms.map((r) => r.id)}
              placeholder="Select a room"
              itemComponent={(itemProps) => {
                const room = props.rooms.find((r) => r.id === itemProps.item.rawValue);
                return (
                  <SelectItem item={itemProps.item}>
                    {room?.name} ({room?.location})
                  </SelectItem>
                );
              }}
            >
              <SelectTrigger>
                <SelectValue<string>>
                  {(state) => {
                    const room = props.rooms.find((r) => r.id === state.selectedOption());
                    return room ? `${room.name} (${room.location})` : 'Select a room';
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <Field of={reservationForm} path={['date']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Date</TextFieldLabel>
            <div class="relative flex items-center">
              <TextFieldInput class="pr-10" name="date" type="date" min={today()} />
              <button
                type="button"
                class="absolute right-3 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={() =>
                  document.querySelector<HTMLInputElement>('input[name="date"]')?.showPicker()
                }
                aria-label="Pick date"
              >
                <Calendar class="h-4 w-4" />
              </button>
            </div>
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <div class="grid grid-cols-2 gap-4">
        <Field of={reservationForm} path={['startTime']}>
          {(field) => (
            <TextField
              name={field.props.name}
              validationState={field?.errors?.length ? 'invalid' : 'valid'}
              value={field.input}
              onChange={field.onInput}
              required
            >
              <TextFieldLabel>Start Time</TextFieldLabel>
              <div class="relative flex items-center">
                <TextFieldInput class="pr-10" type="time" name="startTime" />
                <button
                  type="button"
                  class="absolute right-3 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    document
                      .querySelector<HTMLInputElement>('input[name="startTime"]')
                      ?.showPicker()
                  }
                  aria-label="Pick time"
                >
                  <Clock class="h-4 w-4" />
                </button>
              </div>
              <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
            </TextField>
          )}
        </Field>

        <Field of={reservationForm} path={['endTime']}>
          {(field) => (
            <TextField
              name={field.props.name}
              validationState={field?.errors?.length ? 'invalid' : 'valid'}
              value={field.input}
              onChange={field.onInput}
              required
            >
              <TextFieldLabel>End Time</TextFieldLabel>
              <div class="relative flex items-center">
                <TextFieldInput class="pr-10" name="endTime" type="time" />
                <button
                  type="button"
                  class="absolute right-3 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    document.querySelector<HTMLInputElement>('input[name="endTime"]')?.showPicker()
                  }
                  aria-label="Pick time"
                >
                  <Clock class="h-4 w-4" />
                </button>
              </div>
              <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
            </TextField>
          )}
        </Field>
      </div>

      <div class="border-b pb-2 mb-2 mt-4">
        <h3 class="text-sm font-medium text-muted-foreground">Additional Info</h3>
      </div>

      <Field of={reservationForm} path={['agenda']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
          >
            <TextFieldLabel>Agenda</TextFieldLabel>
            <TextFieldInput placeholder="Meeting agenda or purpose (optional)" />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>

      <Button type="submit" class="mt-2" disabled={reservationForm.isSubmitting}>
        {reservationForm.isSubmitting ? 'Submitting...' : 'Submit Reservation'}
      </Button>
    </Form>
  );
}
