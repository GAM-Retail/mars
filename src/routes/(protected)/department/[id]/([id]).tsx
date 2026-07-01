import { A, createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { getDepartmentById } from '~/server/controller/department.server';
import { getUsersByDepartmentController } from '~/server/controller/user.server';
import { getOrganizersByDepartmentController } from '~/server/controller/organizer.server';
import { For, Show, Suspense } from 'solid-js';
import { CalendarPlus, CircleUser, Building } from 'lucide-solid';
import Loading from '~/components/Loading';
import DetailDepartmentDropdown from '~/routes/(protected)/department/[id]/components/DetailDepartmentDropdown';
import DepartmentDetailUsers from '~/routes/(protected)/department/[id]/components/DepartmentDetailUsers';
import DepartmentDetailOrganizers from '~/routes/(protected)/department/[id]/components/DepartmentDetailOrganizers';
import { UserRole } from '~/types';

export const route = {
  info: {
    title: 'Department',
    description: 'Detail department',
    breadcrumb: {
      href: '#',
      label: 'Detail Department',
    },
    newButtonState: {
      label: 'New Department',
      href: '/department/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function DetailDepartment() {
  const params = useParams<{ id: string }>();

  const data = createAsync(async () => {
    const [department, users, organizers] = await Promise.all([
      getDepartmentById(params.id),
      getUsersByDepartmentController(params.id),
      getOrganizersByDepartmentController(params.id),
    ]);
    return {
      department: department.department,
      users: users.users,
      organizers: organizers.organizers,
    };
  });

  return (
    <Suspense fallback={<Loading />}>
      <Show when={data()}>
        {(d) => (
          <div class="mt-10 px-4 flex flex-col gap-6">
            <div class="flex justify-between items-stretch border-b pb-4">
              <div>
                <p class="text-sm text-muted-foreground">Department</p>
                <h1 class="text-3xl font-semibold tracking-tight">{d().department.name}</h1>
              </div>
              <div class="flex flex-col items-end justify-between">
                <DetailDepartmentDropdown department={d().department} />
                <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <CircleUser class="h-4 w-4" />
                    <span>System</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CalendarPlus class="h-4 w-4" />
                    <span>
                      {d().department.createdAt.toLocaleString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <DepartmentDetailUsers users={d().users} />
                <DepartmentDetailOrganizers organizers={d().organizers} />
              </div>
              <div class="space-y-4">
                <div>
                  <p class="text-xs text-muted-foreground mb-2">Divisions</p>
                  {d().department.organizations.length === 0 ? (
                    <p class="text-sm text-muted-foreground">
                      No divisions are associated with this department
                    </p>
                  ) : (
                    <div class="relative">
                      <div class="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
                        <For each={d().department.organizations}>
                          {(org) => (
                            <A
                              href={`/division/${org.division.id}`}
                              class="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors"
                            >
                              <Building class="h-4 w-4 text-muted-foreground" />
                              <div class="flex flex-col">
                                <span class="text-sm font-medium">{org.division.name}</span>
                              </div>
                            </A>
                          )}
                        </For>
                      </div>
                      <div class="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
