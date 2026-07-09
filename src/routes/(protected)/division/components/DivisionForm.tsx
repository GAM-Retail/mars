import * as v from 'valibot';
import { createForm, DeepPartial, Field, Form, SubmitHandler } from '@formisch/solid';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';

export const DivisionSchema = v.object({
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
});

type DivisionFormProps = {
  onSubmit: SubmitHandler<typeof DivisionSchema>;
  initialValues?: DeepPartial<v.InferInput<typeof DivisionSchema>>;
};

export default function DivisionForm(props: Readonly<DivisionFormProps>) {
  const divisionForm = createForm({
    schema: DivisionSchema,
    initialInput: props.initialValues,
  });

  return (
    <Form
      method="post"
      of={divisionForm}
      onSubmit={(data, e) => {
        e?.preventDefault();
        props.onSubmit(data);
      }}
      class="flex flex-col gap-4"
    >
      <Field of={divisionForm} path={['name']}>
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
      <Button type="submit">Submit</Button>
    </Form>
  );
}
