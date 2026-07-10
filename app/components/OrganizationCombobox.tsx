import { Label } from '~/components/ui/label';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from '~/components/ui/combobox';

type Item = { id: string; name: string };

type OrganizationComboboxProps = {
  divisions: Item[];
  departmentsByDivision: Record<string, Item[]>;
  divisionName: string;
  departmentName: string;
  divisionValue: string;
  departmentValue: string;
  onDivisionChange: (id: string) => void;
  onDepartmentChange: (id: string) => void;
  divisionLabel?: string;
  departmentLabel?: string;
  divisionPlaceholder?: string;
  departmentPlaceholder?: string;
};

export default function OrganizationCombobox({
  divisionLabel = 'Division',
  departmentLabel = 'Department',
  divisionName,
  departmentName,
  divisions,
  departmentsByDivision,
  divisionValue,
  departmentValue,
  onDivisionChange,
  onDepartmentChange,
  divisionPlaceholder,
  departmentPlaceholder,
}: Readonly<OrganizationComboboxProps>) {
  const selectedDivision = divisions.find((d) => d.id === divisionValue) ?? null;
  const availableDepartments = departmentsByDivision[divisionValue] ?? [];
  const selectedDepartment = availableDepartments.find((d) => d.id === departmentValue) ?? null;
  return (
    <div className="grid grid-cols-2 gap-4">
      <input type="hidden" name={divisionName} value={divisionValue} />
      <input type="hidden" name={departmentName} value={departmentValue} />
      <div>
        <Label className="mb-1 block">{divisionLabel}</Label>
        <Combobox
          items={divisions}
          value={selectedDivision}
          onValueChange={(item) => onDivisionChange((item as Item | null)?.id ?? '')}
          itemToStringLabel={(item) => item.name}
        >
          <ComboboxInput placeholder={divisionPlaceholder || 'Select a division'} />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item: Item) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div>
        <Label className="mb-1 block">{departmentLabel}</Label>
        <Combobox
          items={availableDepartments}
          value={selectedDepartment}
          onValueChange={(item) => onDepartmentChange((item as Item | null)?.id ?? '')}
          itemToStringLabel={(item) => item.name}
          disabled={!divisionValue}
        >
          <ComboboxInput
            placeholder={
              !divisionValue
                ? 'Select division first'
                : departmentPlaceholder || 'Select a department'
            }
            disabled={!divisionValue}
          />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item: Item) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
