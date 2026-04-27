import { A, createAsync, RouteDefinition, useAction, useNavigate } from '@solidjs/router';
import { ArrowLeft } from 'lucide-solid';
import { toast } from 'solid-sonner';
import * as v from 'valibot';
import { createForm, Field, Form } from '@formisch/solid';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';
import { updateUserAction } from '~/server/controller/user.server';
import { UserRole } from '~/types';
import { Show } from 'solid-js';
import { getUser } from '~/server/controller/session.server';

export const route = {
  info: {
    title: 'Edit Profile',
    description: 'Edit Profile',
    breadcrumb: {
      href: '/profile/edit',
      label: 'Edit Profile',
    },
    role: [UserRole.SUPERADMIN, UserRole.ADMIN],
  },
} satisfies RouteDefinition;

const ProfileSchema = v.object({
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
  ext: v.optional(v.string()),
  division: v.optional(v.string()),
  department: v.optional(v.string()),
});

export default function EditProfile() {
  const navigate = useNavigate();
  const userResource = createAsync(() => getUser());
  const updateProfile = useAction(updateUserAction);

  const onSubmit = async (data: v.InferInput<typeof ProfileSchema>) => {
    const userId = userResource()?.id;
    if (!userId) return;

    try {
      const result = await updateProfile({
        id: userId,
        nik: data.nik,
        email: data.email,
        name: data.name,
        ext: (data.ext as string) || undefined,
        division: (data.division as string) || undefined,
        department: (data.department as string) || undefined,
        isProfileUpdate: true,
      });
      toast('Profile has been updated', {
        description: `${result.user.name} profile has been updated successfully.`,
      });
      navigate('/profile');
    } catch (error) {
      toast('Failed to update profile', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <Show when={userResource()}>
      <div class="max-w-md sm:max-w-lg border rounded-md mx-auto mt-10 p-4 flex gap-4 flex-col bg-secondary">
        <span>
          <A href="/profile" class="flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft class=" h-4 w-4" />
            Back
          </A>
          <h2 class="text-xl font-semibold">Edit profile</h2>
        </span>
        <Form
          method="post"
          of={createForm({
            schema: ProfileSchema,
            initialInput: {
              nik: userResource()?.nik,
              name: userResource()?.name,
              email: userResource()?.email,
              ext: userResource()?.ext || undefined,
              division: userResource()?.division || undefined,
              department: userResource()?.department || undefined,
            },
          })}
          onSubmit={(data, e) => {
            e?.preventDefault();
            onSubmit(data);
          }}
          class="flex flex-col gap-4"
        >
          <Field of={createForm({ schema: ProfileSchema })} path={['nik']}>
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
          <Field of={createForm({ schema: ProfileSchema })} path={['name']}>
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
          <Field of={createForm({ schema: ProfileSchema })} path={['email']}>
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
          <Field of={createForm({ schema: ProfileSchema })} path={['ext']}>
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
          <Field of={createForm({ schema: ProfileSchema })} path={['division']}>
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
          <Field of={createForm({ schema: ProfileSchema })} path={['department']}>
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
      </div>
    </Show>
  );
}
