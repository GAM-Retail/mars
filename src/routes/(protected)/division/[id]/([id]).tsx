import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { getDivisionById } from '~/server/controller/division.server';
import { Suspense } from 'solid-js';
import { CalendarPlus, CircleUser } from 'lucide-solid';
import Loading from '~/components/Loading';
import DetailDivisionDropdown from '~/routes/(protected)/division/[id]/components/DetailDivisionDropdown';
import { UserRole } from '~/types';
import { DivisionModel } from '~/generated/prisma/models';

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
  const division = createAsync(() => getDivisionById(params.id));

  return (
    <Suspense fallback={<Loading />}>
      <div class="mt-10 px-4 flex flex-col gap-6">
        <div class="flex justify-between items-stretch border-b pb-4">
          <div>
            <p class="text-sm text-muted-foreground">Division</p>
            <h1 class="text-3xl font-semibold tracking-tight">{division()?.division.name}</h1>
          </div>
          <div class="flex flex-col items-end justify-between">
            <DetailDivisionDropdown division={division()?.division as DivisionModel} />
            <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <CircleUser class="h-4 w-4" />
                <span>System</span>
              </div>
              <div class="flex items-center gap-2">
                <CalendarPlus class="h-4 w-4" />
                <span>
                  {division()?.division.createdAt.toLocaleString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
