import {useContext} from "solid-js";
import {redirect} from "@solidjs/router";
import {CurrentUserContext} from "~/context/currentUser";

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw redirect("/login");
  }
  return context;
}