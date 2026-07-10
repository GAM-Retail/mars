import { useEffect } from 'react';
import { useLoaderData, useFetcher, Link, useNavigate } from 'react-router';
import { CalendarPlus, CircleUser, Building } from 'lucide-react';
import DetailDepartmentDropdown from './components/DetailDepartmentDropdown';
import { toast } from 'sonner';

import {
  getDepartmentById,
  deleteDepartmentById,
  getDepartmentByIdRaw,
} from '~/lib/services/department.server';
import { getUsersByDepartmentController } from '~/lib/services/user.server';
import { getOrganizersByDepartmentController } from '~/lib/services/organizer.server';
import { getCurrentUser } from '~/lib/current-user.server';
import { catchResult } from '~/lib/error/response.server';

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  const [department, users, organizers] = await Promise.all([
    getDepartmentById(params.id),
    getUsersByDepartmentController(request, params.id),
    getOrganizersByDepartmentController(request, params.id),
  ]);
  return {
    department: department.department,
    users: users.users,
    organizers: organizers.organizers,
  };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  try {
    await getCurrentUser(request);
    const current = await getDepartmentByIdRaw(params.id);
    if (!current) return { success: false, message: 'Department not found' };
    await deleteDepartmentById(params.id);
    return { deleted: true };
  } catch (err) {
    return catchResult(err);
  }
}

export default function DetailDepartment() {
  const { department, users, organizers } = useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (deleteFetcher.data?.deleted) {
      toast.success('Department has been deleted');
      navigate('/departments');
    }
  }, [deleteFetcher.data, navigate]);

  return (
    <div className="mt-10 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-stretch border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Department</p>
          <h1 className="text-3xl font-semibold tracking-tight">{department.name}</h1>
        </div>
        <div className="flex flex-col items-end justify-between">
          <DetailDepartmentDropdown
            department={department}
            onDelete={() => deleteFetcher.submit(null, { method: 'delete' })}
          />
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CircleUser className="h-4 w-4" />
              <span>System</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              <span>
                {new Date(department.createdAt).toLocaleString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DepartmentDetailUsers users={users} />
          <DepartmentDetailOrganizers organizers={organizers} />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Divisions</p>
            {department.organizations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No divisions are associated with this department
              </p>
            ) : (
              <div className="relative">
                <div className="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
                  {department.organizations.map(
                    (org: { division: { id: string; name: string } }) => (
                      <Link
                        key={org.division.id}
                        to={`/divisions/${org.division.id}`}
                        className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors"
                      >
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{org.division.name}</span>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartmentDetailUsers(props: {
  users: Array<{ id: string; nik: string; name: string; email: string }>;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Users</p>
      {props.users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No users are assigned to this department</p>
      ) : (
        <div className="relative">
          <div className="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
            {props.users.map((user) => (
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

function DepartmentDetailOrganizers(props: {
  organizers: Array<{ id: string; nik: string; name: string; email: string; phone: string }>;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Organizers</p>
      {props.organizers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No organizers are assigned to this department
        </p>
      ) : (
        <div className="relative">
          <div className="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
            {props.organizers.map((organizer) => (
              <div key={organizer.id} className="flex items-center gap-2 p-2 rounded-md border">
                <CircleUser className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{organizer.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{organizer.email}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
