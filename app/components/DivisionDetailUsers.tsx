import { Link } from 'react-router';
import { CircleUser } from 'lucide-react';

type UserItem = {
  id: string;
  nik: string;
  name: string;
  email: string;
};

type Props = {
  users: UserItem[];
};

export default function DivisionDetailUsers({ users }: Readonly<Props>) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Users</p>
      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No users are assigned to this division</p>
      ) : (
        <div className="relative">
          <div className="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
            {users.map((user) => (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors"
              >
                <CircleUser className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
