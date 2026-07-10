import type { ReactNode } from 'react';
import { CurrentUserContext } from '~/context/currentUser';
import type { CurrentUser } from '~/types';

export default function CurrentUserProvider({
  currentUser,
  children,
}: Readonly<{
  currentUser: CurrentUser | null;
  children: ReactNode;
}>) {
  return (
    <CurrentUserContext.Provider value={{ currentUser }}>{children}</CurrentUserContext.Provider>
  );
}
