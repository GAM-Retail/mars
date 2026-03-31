import {createAsync, type RouteDefinition, RouteSectionProps} from "@solidjs/router";
import {getUser} from "~/lib";
import CurrentUserProvider from "~/components/CurrentUserProvider";

export const route = {
  preload() {
    getUser();
  }
} satisfies RouteDefinition;

export default function Protected(props: Readonly<RouteSectionProps>) {
  const user = createAsync(() => getUser(), { deferStream: true });

  return (
    <CurrentUserProvider currentUser={user()}>
      {props.children}
    </CurrentUserProvider>
  )
}