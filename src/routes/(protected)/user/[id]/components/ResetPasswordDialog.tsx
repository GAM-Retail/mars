import { useAction } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { toast } from 'solid-sonner';
import * as v from 'valibot';
import { createForm, Field, Form } from '@formisch/solid';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';
import { resetPasswordAction } from '~/server/controller/user.server';

const ResetPasswordSchema = v.object({
  newPassword: v.pipe(
    v.string('Please enter a new password'),
    v.nonEmpty('Please enter a new password'),
    v.minLength(6, 'Password must be at least 6 characters'),
  ),
  confirmPassword: v.pipe(
    v.string('Please confirm new password'),
    v.nonEmpty('Please confirm new password'),
  ),
});

export function ResetPasswordDialog(
  props: Readonly<{
    userId: string;
    userName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>,
) {
  const resetPassword = useAction(resetPasswordAction);
  const [loading, setLoading] = createSignal(false);

  const form = createForm({
    schema: ResetPasswordSchema,
  });

  const onSubmit = async (data: v.InferInput<typeof ResetPasswordSchema>) => {
    if (data.newPassword !== data.confirmPassword) {
      toast('Passwords do not match', {
        description: 'New password and confirmation must be the same',
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        id: props.userId,
        newPassword: data.newPassword,
      });
      toast('Password has been reset', {
        description: `Password for ${props.userName} has been reset successfully.`,
      });
      props.onOpenChange(false);
    } catch (error) {
      toast('Failed to reset password', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Reset Password</AlertDialogTitle>
        <AlertDialogDescription>
          <div class="flex flex-col gap-4">
            <p class="text-sm text-muted-foreground">
              You are about to reset the password for{' '}
              <span class="font-medium">{props.userName}</span>. This action cannot be undone.
            </p>
            <Form
              method="post"
              of={form}
              onSubmit={(data, e) => {
                e?.preventDefault();
                if (!loading()) {
                  onSubmit(data);
                }
              }}
              class="flex flex-col gap-4"
            >
              <Field of={form} path={['newPassword']}>
                {(field) => (
                  <TextField
                    name={field.props.name}
                    validationState={field?.errors?.length ? 'invalid' : 'valid'}
                    value={field.input}
                    onChange={field.onInput}
                    required
                  >
                    <TextFieldLabel>New Password</TextFieldLabel>
                    <TextFieldInput type="password" />
                    <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
                  </TextField>
                )}
              </Field>
              <Field of={form} path={['confirmPassword']}>
                {(field) => (
                  <TextField
                    name={field.props.name}
                    validationState={field?.errors?.length ? 'invalid' : 'valid'}
                    value={field.input}
                    onChange={field.onInput}
                    required
                  >
                    <TextFieldLabel>Confirm New Password</TextFieldLabel>
                    <TextFieldInput type="password" />
                    <TextFieldErrorMessage>{field?.errors?.[0]}</TextFieldErrorMessage>
                  </TextField>
                )}
              </Field>
              <div class="flex gap-2">
                <Button type="submit" disabled={loading()}>
                  {loading() ? 'Resetting...' : 'Reset Password'}
                </Button>
                <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
