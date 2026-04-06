import { useSubmission, type RouteSectionProps } from '@solidjs/router';
import { Show } from 'solid-js';
import { loginAction } from '~/lib';
import { Button } from '~/components/ui/button';
import { TextField, TextFieldInput, TextFieldLabel } from '~/components/ui/text-field';
import { ModeToggle } from '~/components/ModeToggle';

export default function Login(props: Readonly<RouteSectionProps>) {
  const loggingIn = useSubmission(loginAction);
  return (
    <main class="w-full h-screen">
      <ModeToggle />
      <div class="flex flex-col items-center justify-center h-9/10">
        <h1>Login</h1>
        <div class="w-72">
          <form action={loginAction} method="post" class="flex flex-col gap-2">
            <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? '/'} />

            <TextField name="username" class="w-full">
              <TextFieldLabel>Username</TextFieldLabel>
              <TextFieldInput placeholder="kody" />
            </TextField>
            <TextField name="password">
              <TextFieldLabel>Password</TextFieldLabel>
              <TextFieldInput type="password" placeholder="twixrox" />
            </TextField>
            <Button type="submit" size="xs">
              Login
            </Button>
            <Show when={loggingIn.result}>
              <p style={{ color: 'red' }} role="alert" id="error-message">
                {loggingIn.result!.message}
              </p>
            </Show>
          </form>
        </div>
      </div>
    </main>
  );
}
