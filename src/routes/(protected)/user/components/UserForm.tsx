import * as v from 'valibot';
import { createForm, DeepPartial, Field, Form, getInput } from '@formisch/solid';
import { createMemo, createSignal, Show, untrack } from 'solid-js';
import { createAsync } from '@solidjs/router';
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
import OrganizationsCombobox from '~/components/OrganizationsCombobox';
import {
  getAllDivision,
  getDepartmentsByDivisionIdQuery,
} from '~/server/controller/division.server';

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
  // Formisch's <Form> cannot accept FormStore<CreateSchema> | FormStore<UpdateSchema>
  // that's why, `password` is optional in the shared schema and validate manually when creating a users.
  // Ref: https://github.com/open-circle/formisch/issues/152
  password: v.optional(
    v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters')),
  ),
  ext: v.optional(v.string()),
  division: v.nullish(v.object({ label: v.string(), value: v.string() })),
  department: v.nullish(v.object({ label: v.string(), value: v.string() })),
});

type UserFormProps =
  | {
      formType: 'create';
      onSubmit: (data: v.InferInput<typeof UserSchema>) => void;
    }
  | {
      formType: 'update';
      onSubmit: (data: v.InferInput<typeof UserSchema>) => void;
      initialValues?: DeepPartial<v.InferInput<typeof UserSchema>>;
    };

export default function UserForm(props: Readonly<UserFormProps>) {
  const userForm = createForm({
    schema: UserSchema,
    initialInput: untrack(() => (props.formType === 'update' ? props.initialValues : undefined)),
  });

  const divisions = createAsync(() => getAllDivision());
  const divisionOptions = () =>
    divisions()?.divisions?.map((d) => ({ label: d.name, value: d.id })) ?? [];
  const [selectedDivision, setSelectedDivision] = createSignal(
    null as { label: string; value: string } | null,
  );
  const departments = createAsync(async () => {
    const divisionId = '';
    if (!divisionId) return null;

    return getDepartmentsByDivisionIdQuery(divisionId);
  });
  const departmentOptions = () =>
    departments()?.departments?.map((d) => ({ label: d.name, value: d.id })) ?? [];

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
      <Show when={props.formType === 'create'}>
        <Field of={userForm} path={['password']}>
          {(field) => (
            <TextField
              name={field.props.name}
              validationState={field?.errors?.length ? 'invalid' : 'valid'}
              value={field.input}
              onChange={field.onInput}
              required
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
          <OrganizationsCombobox
            label="Divisions"
            description="Please select division for user"
            options={divisionOptions()}
            value={field.input as { label: string; value: string } | null}
            onChange={(value) => {
              setSelectedDivision(value);
              field.onInput(value);
            }}
            name={field.props.name}
          />
        )}
      </Field>
      <Field of={userForm} path={['department']}>
        {(field) => (
          <OrganizationsCombobox
            label="Departments"
            description={
              selectedDivision()
                ? 'Please select department for users'
                : 'Please select division first before selecting department'
            }
            options={departmentOptions()}
            value={field.input as { label: string; value: string } | null}
            onChange={(value) => field.onInput(value)}
            name={field.props.name}
            disabled={!selectedDivision()}
          />
        )}
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
