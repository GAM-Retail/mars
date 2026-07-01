import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { getDepartmentById } from '~/server/controller/department.server';
import { Suspense } from 'solid-js';
import { CalendarPlus, CircleUser } from 'lucide-solid';
import Loading from '~/components/Loading';
import DetailDepartmentDropdown from '~/routes/(protected)/department/[id]/components/DetailDepartmentDropdown';
import { UserRole } from '~/types';
import { DepartmentModel } from '~/generated/prisma/models';

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
  const department = createAsync(() => getDepartmentById(params.id));

  return (
    <Suspense fallback={<Loading />}>
      <div class="mt-10 px-4 flex flex-col gap-6">
        <div class="flex justify-between items-stretch border-b pb-4">
          <div>
            <p class="text-sm text-muted-foreground">Department</p>
            <h1 class="text-3xl font-semibold tracking-tight">{department()?.department.name}</h1>
          </div>
          <div class="flex flex-col items-end justify-between">
            <DetailDepartmentDropdown department={department()?.department as DepartmentModel} />
            <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <CircleUser class="h-4 w-4" />
                <span>System</span>
              </div>
              <div class="flex items-center gap-2">
                <CalendarPlus class="h-4 w-4" />
                <span>
                  {department()?.department.createdAt.toLocaleString('id-ID', {
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
