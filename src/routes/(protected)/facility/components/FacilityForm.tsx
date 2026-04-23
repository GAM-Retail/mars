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
export const FacilitySchema = v.object({
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
  description: v.optional(v.string()),
});
type FacilityFormProps = {
  onSubmit: SubmitHandler<typeof FacilitySchema>;
  initialValues?: DeepPartial<v.InferInput<typeof FacilitySchema>>;
};
export default function FacilityForm(props: Readonly<FacilityFormProps>) {
  const facilityForm = createForm({
    schema: FacilitySchema,
    initialInput: props.initialValues,
  });

  return (
    <Form
      method="post"
      of={facilityForm}
      onSubmit={(data, e) => {
        e?.preventDefault();
        props.onSubmit(data);
      }}
      class="flex flex-col gap-4"
    >
      <Field of={facilityForm} path={['name']}>
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
      <Field of={facilityForm} path={['description']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
          >
            <TextFieldLabel>Description</TextFieldLabel>
            <TextFieldTextArea
              value={field.input}
              onInput={(e) => field.onInput(e.currentTarget.value)}
            />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
