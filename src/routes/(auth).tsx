import { createEffect, Show } from 'solid-js';
import { createAsync, RouteSectionProps, useNavigate } from '@solidjs/router';
import { getUser } from '~/lib';

export default function Auth(props: Readonly<RouteSectionProps>) {
  const user = createAsync(() => getUser(), { deferStream: true });

  const navigate = useNavigate();
  createEffect(() => {
    if (user()) {
      navigate('/', { replace: true });
    }
  });
  return <Show when={!user()}>{props.children}</Show>;
}
