import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { getDivisionById, getAllDepartmentsForDivision } from '~/server/controller/division.server';
import { getUsersByDivisionController } from '~/server/controller/user.server';
import { getOrganizersByDivisionController } from '~/server/controller/organizer.server';
import { Show, Suspense } from 'solid-js';
import { CalendarPlus, CircleUser } from 'lucide-solid';
import Loading from '~/components/Loading';
import DetailDivisionDropdown from '~/routes/(protected)/division/[id]/components/DetailDivisionDropdown';
import DivisionDetailDepartments from '~/routes/(protected)/division/[id]/components/DivisionDetailDepartments';
import DivisionDetailUsers from '~/routes/(protected)/division/[id]/components/DivisionDetailUsers';
import DivisionDetailOrganizers from '~/routes/(protected)/division/[id]/components/DivisionDetailOrganizers';
import { UserRole } from '~/types';

export const route = {
  info: {
    title: 'Division',
    description: 'Detail division',
    breadcrumb: {
      href: '#',
      label: 'Detail Division',
    },
    newButtonState: {
      label: 'New Division',
      href: '/division/new',
      role: [UserRole.SUPERADMIN],
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function DetailDivision() {
  const params = useParams<{ id: string }>();

  const data = createAsync(async () => {
    const [division, departments, users, organizers] = await Promise.all([
      getDivisionById(params.id),
      getAllDepartmentsForDivision(),
      getUsersByDivisionController(params.id),
      getOrganizersByDivisionController(params.id),
    ]);
    return {
      division: division.division,
      departments: departments.departments,
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
                <p class="text-sm text-muted-foreground">Division</p>
                <h1 class="text-3xl font-semibold tracking-tight">{d().division.name}</h1>
              </div>
              <div class="flex flex-col items-end justify-between">
                <DetailDivisionDropdown division={d().division} />
                <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <CircleUser class="h-4 w-4" />
                    <span>System</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CalendarPlus class="h-4 w-4" />
                    <span>
                      {d().division.createdAt.toLocaleString('id-ID', {
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
                <DivisionDetailUsers users={d().users} />
                <DivisionDetailOrganizers organizers={d().organizers} />
              </div>
              <div class="space-y-4">
                <DivisionDetailDepartments
                  divisionId={params.id}
                  division={d().division}
                  allDepartments={d().departments}
                />
              </div>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
