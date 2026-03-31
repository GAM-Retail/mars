import {createContext} from "solid-js";
import {CurrentUser as CurrentUserTypes} from "~/types";

export const CurrentUserContext = createContext<{ currentUser: CurrentUserTypes | null }>({ currentUser: null })