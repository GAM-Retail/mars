import { createStore } from 'solid-js/store';
import { CurrentUserContext } from '~/context/currentUser';
import { CurrentUser as CurrentUserTypes } from '~/types';
import { createEffect, JSX } from 'solid-js';

export default function CurrentUserProvider(
  props: Readonly<{
    currentUser: CurrentUserTypes;
    children: JSX.Element;
  }>,
) {
  const [store, setStore] = createStore<{ currentUser: CurrentUserTypes }>({
    get currentUser() {
      return props.currentUser;
    },
  });
  createEffect(() => {
    setStore('currentUser', props.currentUser);
  });

  return <CurrentUserContext.Provider value={store}>{props.children}</CurrentUserContext.Provider>;
}
