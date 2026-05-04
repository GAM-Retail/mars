import * as v from 'valibot';
import { createForm, DeepPartial, Field, Form } from '@formisch/solid';
import { Show } from 'solid-js';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export const UserSchema = v.object({
  nik: v.pipe(
    v.string('Please enter a NIK'),
    v.nonEmpty('Please enter a NIK'),
    v.length(6, 'NIK must be 6 digits'),
  ),
  email: v.pipe(
    v.string('Please enter an email'),
    v.nonEmpty('Please enter an email'),
    v.email('Please enter a valid email'),
  ),
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
  role: v.pipe(v.string('Please select a role'), v.nonEmpty('Please select a role')),
  password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters')),
  ext: v.optional(v.string()),
  division: v.optional(v.string()),
  department: v.optional(v.string()),
});

type UserFormProps = {
  onSubmit: (data: v.InferInput<typeof UserSchema>) => void;
  initialValues?: DeepPartial<v.InferInput<typeof UserSchema>>;
  showPassword?: boolean;
};

export default function UserForm(props: Readonly<UserFormProps>) {
  const userForm = createForm({
    schema: UserSchema,
    initialInput: props.initialValues,
  });

  return (
    <Form
      method="post"
      of={userForm}
      onSubmit={(data, e) => {
        e?.preventDefault();
        props.onSubmit(data);
      }}
      class="flex flex-col gap-4"
    >
      <Field of={userForm} path={['nik']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>NIK</TextFieldLabel>
            <TextFieldInput />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Field of={userForm} path={['name']}>
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
      <Field of={userForm} path={['email']}>
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
      <Field of={userForm} path={['role']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
            required
          >
            <TextFieldLabel>Role</TextFieldLabel>
            <Select
              value={field.input}
              onChange={(value) => value && field.onInput(value)}
              options={['SUPERADMIN', 'ADMIN']}
              placeholder="Select a role"
              itemComponent={(itemProps) => (
                <SelectItem item={itemProps.item}>
                  {itemProps.item.rawValue === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
                </SelectItem>
              )}
            >
              <SelectTrigger>
                <SelectValue<string>>
                  {(state) => state.selectedOption() || 'Select a role'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Show when={props.showPassword}>
        <Field of={userForm} path={['password']}>
          {(field) => (
            <TextField
              name={field.props.name}
              validationState={field?.errors?.length ? 'invalid' : 'valid'}
              value={field.input}
              onChange={field.onInput}
              required={props.showPassword}
            >
              <TextFieldLabel>Password</TextFieldLabel>
              <TextFieldInput type="password" />
              <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
            </TextField>
          )}
        </Field>
      </Show>
      <Field of={userForm} path={['ext']}>
        {(field) => (
          <TextField
            name={field.props.name}
            validationState={field?.errors?.length ? 'invalid' : 'valid'}
            value={field.input}
            onChange={field.onInput}
          >
            <TextFieldLabel>Extension</TextFieldLabel>
            <TextFieldInput placeholder="1234" />
            <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
          </TextField>
        )}
      </Field>
      <Field of={userForm} path={['division']}>
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
      <Field of={userForm} path={['department']}>
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
      <Button type="submit">Submit</Button>
    </Form>
  );
}
