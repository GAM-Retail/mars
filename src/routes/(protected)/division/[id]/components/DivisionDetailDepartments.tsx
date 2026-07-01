import { toast } from 'solid-sonner';
import { useAction } from '@solidjs/router';
import {
  addDepartmentToDivisionAction,
  removeDepartmentFromDivisionAction,
} from '~/server/controller/division.server';
import SearchableSheet from '~/routes/(protected)/room/[id]/components/SearchableSheet';
import type { DivisionGetPayload } from '~/generated/prisma/models/Division';

type DivisionWithDepartments = DivisionGetPayload<{
  include: {
    organizations: { include: { department: true } };
  };
}>;

type Props = {
  divisionId: string;
  division: DivisionWithDepartments;
  allDepartments: { id: string; name: string }[];
};

export default function DivisionDetailDepartments(props: Readonly<Props>) {
  const addDepartmentAction = useAction(addDepartmentToDivisionAction);
  const removeDepartmentAction = useAction(removeDepartmentFromDivisionAction);

  const selectedDepartments = () =>
    props.division.organizations.map((org) => ({
      id: org.department.id,
      name: org.department.name,
    }));

  const handleAdd = async (departmentId: string) => {
    try {
      await addDepartmentAction(props.divisionId, departmentId);
      toast('Department added to division');
    } catch (error) {
      toast('Failed to add department', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleRemove = async (departmentId: string) => {
    try {
      await removeDepartmentAction(props.divisionId, departmentId);
      toast('Department removed from division');
    } catch (error) {
      toast('Failed to remove department', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div>
      <p class="text-xs text-muted-foreground mb-2">Departments</p>
      <SearchableSheet
        title="Add Departments"
        description="Search and select departments to add to this division."
        searchPlaceholder="Search departments..."
        availableItems={props.allDepartments}
        selectedItems={selectedDepartments()}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  );
}
