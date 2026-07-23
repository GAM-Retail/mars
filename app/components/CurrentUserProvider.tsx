import type { ReactNode } from 'react';
import { CurrentUserContext } from '~/context/currentUser';
import { CurrentUser } from '~/lib/current-user.server';

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
