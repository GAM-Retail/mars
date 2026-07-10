import SearchableSheet from '~/components/SearchableSheet';

type DivisionWithDepartments = {
  id: string;
  name: string;
  organizations: { department: { id: string; name: string } }[];
};

type Props = {
  division: DivisionWithDepartments;
  allDepartments: { id: string; name: string }[];
  onAddDepartment: (departmentId: string) => Promise<void>;
  onRemoveDepartment: (departmentId: string) => Promise<void>;
};

export default function DivisionDetailDepartments({
  division,
  allDepartments,
  onAddDepartment,
  onRemoveDepartment,
}: Readonly<Props>) {
  const selectedDepartments = division.organizations.map((org) => ({
    id: org.department.id,
    name: org.department.name,
  }));

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Departments</p>
      <SearchableSheet
        title="Add Departments"
        description="Search and select departments to add to this division."
        searchPlaceholder="Search departments..."
        availableItems={allDepartments}
        selectedItems={selectedDepartments}
        onAdd={onAddDepartment}
        onRemove={onRemoveDepartment}
      />
    </div>
  );
}
