import { logout } from "~/lib";
import {useCurrentUser} from "~/hooks/useCurrentUser";


export default function Home() {
  const userContext = useCurrentUser()
  return (
    <div class="w-full space-y-2">
      <h2 class="font-bold text-3xl text-violet-500">Hello {userContext?.currentUser?.username}</h2>
      <h3 class="font-bold text-xl">Message board</h3>
      <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
    </div>
  );
}
