import { createContext } from 'react';
import { CurrentUser } from '~/lib/current-user.server';

export type CurrentUserContextValue = {
  currentUser: CurrentUser | null;
};

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  currentUser: null,
});
