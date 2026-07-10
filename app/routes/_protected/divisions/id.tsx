import { useEffect } from 'react';
import { useLoaderData, useFetcher, useNavigate } from 'react-router';
import { CalendarPlus, CircleUser } from 'lucide-react';
import DetailDivisionDropdown from '~/components/DetailDivisionDropdown';
import DivisionDetailDepartments from '~/components/DivisionDetailDepartments';
import DivisionDetailUsers from '~/components/DivisionDetailUsers';
import DivisionDetailOrganizers from '~/components/DivisionDetailOrganizers';
import { toast } from 'sonner';

import {
  getDivisionById,
  getAllDepartmentsForDivision,
  deleteDivisionById,
  addDepartmentToDivision,
  removeDepartmentFromDivision,
} from '~/lib/services/division.server';
import { getUsersByDivisionId } from '~/lib/services/user.server';
import { getOrganizersByDivisionId } from '~/lib/services/organizer.server';
import { getCurrentUser } from '~/lib/current-user.server';

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  await getCurrentUser(request);
  const [division, departments, users, organizers] = await Promise.all([
    getDivisionById(params.id),
    getAllDepartmentsForDivision(),
    getUsersByDivisionId(params.id),
    getOrganizersByDivisionId(params.id),
  ]);
  return {
    division: division.division,
    departments: departments.departments,
    users,
    organizers,
  };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  await getCurrentUser(request);
  if (request.method === 'DELETE') {
    await deleteDivisionById(params.id);
    return { deleted: true };
  }
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  if (intent === 'add-department') {
    const departmentId = formData.get('departmentId') as string;
    await addDepartmentToDivision(params.id, departmentId);
    return { success: true };
  }
  if (intent === 'remove-department') {
    const departmentId = formData.get('departmentId') as string;
    await removeDepartmentFromDivision(params.id, departmentId);
    return { success: true };
  }
  return { success: false };
}

export default function DetailDivision() {
  const { division, departments, users, organizers } = useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (deleteFetcher.data?.deleted) {
      toast.success('Home has been deleted');
      navigate('/divisions');
    }
  }, [deleteFetcher.data, navigate]);

  useEffect(() => {
    if (deleteFetcher.data?.success) {
      toast.success('Department updated');
    }
  }, [deleteFetcher.data]);

  const handleAddDepartment = async (departmentId: string) => {
    const formData = new FormData();
    formData.set('intent', 'add-department');
    formData.set('departmentId', departmentId);
    deleteFetcher.submit(formData, { method: 'post' });
  };

  const handleRemoveDepartment = async (departmentId: string) => {
    const formData = new FormData();
    formData.set('intent', 'remove-department');
    formData.set('departmentId', departmentId);
    deleteFetcher.submit(formData, { method: 'post' });
  };

  return (
    <div className="mt-10 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-stretch border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Division</p>
          <h1 className="text-3xl font-semibold tracking-tight">{division.name}</h1>
        </div>
        <div className="flex flex-col items-end justify-between">
          <DetailDivisionDropdown
            division={division}
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
                {new Date(division.createdAt).toLocaleDateString('en-US', {
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
          <DivisionDetailUsers users={users} />
          <DivisionDetailOrganizers organizers={organizers} />
        </div>
        <div className="space-y-4">
          <DivisionDetailDepartments
            division={division}
            allDepartments={departments}
            onAddDepartment={handleAddDepartment}
            onRemoveDepartment={handleRemoveDepartment}
          />
        </div>
      </div>
    </div>
  );
}
