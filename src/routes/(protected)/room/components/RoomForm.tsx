import * as v from 'valibot';
import { createForm, DeepPartial, Field, Form, SubmitHandler } from '@formisch/solid';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';
export const RoomSchema = v.object({
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
  location: v.pipe(
    v.string('Please enter a location for the room'),
    v.nonEmpty('Please enter a location for the room'),
  ),
  capacity: v.pipe(v.number('Please input room capacity'), v.integer(), v.toMinValue(1)),
  description: v.optional(v.string()),
});
type RoomFormProps = {
  onSubmit: SubmitHandler<typeof RoomSchema>;
  initialValues?: DeepPartial<v.InferInput<typeof RoomSchema>>;
};
export default function RoomForm(props: Readonly<RoomFormProps>) {
  const roomForm = createForm({
    schema: RoomSchema,
    initialInput: props.initialValues,
  });

  return (
    <Form
      method="post"
      of={roomForm}
      onSubmit={(data, e) => {
        e?.preventDefault();
        props.onSubmit(data);
      }}
      class="flex flex-col gap-4"
    >
      <Field of={roomForm} path={['name']}>
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
      <Field of={roomForm} path={['capacity']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={String(field.input)}
            onChange={(value) => field.onInput(Number(value))}
            required
          >
            <TextFieldLabel>Capacity</TextFieldLabel>
            <TextFieldInput type="number" />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Field of={roomForm} path={['location']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Location</TextFieldLabel>
            <TextFieldTextArea />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Field of={roomForm} path={['description']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
          >
            <TextFieldLabel>Description</TextFieldLabel>
            <TextFieldTextArea />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
