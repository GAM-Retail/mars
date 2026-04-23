import { A, createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { getFacilityById, getRoomsByFacilityId } from '~/server/controller/facility.server';
import { For, Suspense } from 'solid-js';
import { CalendarPlus, CircleUser, Building } from 'lucide-solid';
import Loading from '~/components/Loading';
import DetailFacilityDropdown from '~/routes/(protected)/facility/[id]/components/DetailFacilityDropdown';
import { UserRole } from '~/types';
import { FacilityModel } from '~/generated/prisma/models';

export const route = {
  info: {
    title: 'Facility',
    description: 'Detail facility',
    breadcrumb: {
      href: '#',
      label: 'Detail Facility',
    },
    newButtonState: {
      label: 'New Facility',
      href: '/facility/new',
    },
    role: [UserRole.SUPERADMIN],
  },
} satisfies RouteDefinition;

export default function DetailFacility() {
  const params = useParams<{ id: string }>();
  const facility = createAsync(() => getFacilityById(params.id));
  const rooms = createAsync(() => getRoomsByFacilityId(params.id));

  return (
    <Suspense fallback={<Loading />}>
      <div class="mt-10 px-4 flex flex-col gap-6">
        <div class="flex justify-between items-stretch border-b pb-4">
          <div>
            <p class="text-sm text-muted-foreground">Facility</p>
            <h1 class="text-3xl font-semibold tracking-tight">{facility()?.facility.name}</h1>
          </div>
          <div class="flex flex-col items-end justify-between">
            <DetailFacilityDropdown facility={facility()?.facility as FacilityModel} />
            <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <CircleUser class="h-4 w-4" />
                <span>{facility()?.facility.createdByUser?.name ?? 'System'}</span>
              </div>
              <div class="flex items-center gap-2">
                <CalendarPlus class="h-4 w-4" />
                <span>
                  {facility()?.facility.createdAt.toLocaleString('id-ID', {
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
            <div>
              <p class="text-xs text-muted-foreground mb-1">Description</p>
              <p class="text-sm">{facility()?.facility.description || '-'}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-muted-foreground mb-2">Rooms with this facility</p>
              {rooms()?.roomFacilities.length === 0 ? (
                <p class="text-sm text-muted-foreground">No rooms have this facility</p>
              ) : (
                <div class="relative">
                  <div class="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
                    <For each={rooms()?.roomFacilities}>
                      {(rf) => (
                        <A
                          href={`/room/${rf.room.id}`}
                          class="flex items-center gap-2 p-2 rounded-md border hover:bg-accent transition-colors"
                        >
                          <Building class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-sm font-medium">{rf.room.name}</span>
                            <span class="text-xs text-muted-foreground">{rf.room.location}</span>
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
    </Suspense>
  );
}
