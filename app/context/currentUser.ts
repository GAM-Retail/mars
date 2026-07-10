import { createContext } from 'react';
import type { CurrentUser } from '~/types';

export type CurrentUserContextValue = {
  currentUser: CurrentUser | null;
};

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  currentUser: null,
});
