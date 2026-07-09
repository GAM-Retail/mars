import * as v from 'valibot';
import { createForm, DeepPartial, Field, Form, SubmitHandler } from '@formisch/solid';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';

export const DepartmentSchema = v.object({
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
});

type DepartmentFormProps = {
  onSubmit: SubmitHandler<typeof DepartmentSchema>;
  initialValues?: DeepPartial<v.InferInput<typeof DepartmentSchema>>;
};

export default function DepartmentForm(props: Readonly<DepartmentFormProps>) {
  const departmentForm = createForm({
    schema: DepartmentSchema,
    initialInput: props.initialValues,
  });

  return (
    <Form
      method="post"
      of={departmentForm}
      onSubmit={(data, e) => {
        e?.preventDefault();
        props.onSubmit(data);
      }}
      class="flex flex-col gap-4"
    >
      <Field of={departmentForm} path={['name']}>
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
