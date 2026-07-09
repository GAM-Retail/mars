import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxDescription,
  ComboboxHiddenSelect,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxLabel,
  ComboboxTrigger,
} from '~/components/ui/combobox';
type OrganizationsComboboxProps = {
  label: string;
  description: string;
  options: { label: string; value: string }[];
  value: { label: string; value: string } | null;
  onChange: (value: { label: string; value: string } | null) => void;
  name: string;
  placeholder?: string;
  disabled?: boolean;
};
export default function OrganizationsCombobox(props: Readonly<OrganizationsComboboxProps>) {
  return (
    <Combobox
      name={props.name}
      options={props.options}
      placeholder={props.placeholder ?? 'Select an organization'}
      value={props.value}
      onChange={(value) => props.onChange(value)}
      optionValue={(option) => option.value}
      optionTextValue={(option) => option.label}
      optionLabel={(option) => option.label}
      disabled={props.disabled}
      itemComponent={(props) => (
        <ComboboxItem item={props.item}>
          <ComboboxItemLabel>{props.item.rawValue.label}</ComboboxItemLabel>
          <ComboboxItemIndicator />
        </ComboboxItem>
      )}
    >
      <ComboboxLabel>{props.label}</ComboboxLabel>
      <ComboboxHiddenSelect />
      <ComboboxControl aria-label={props.label}>
        <ComboboxInput />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxDescription class="text-xs">{props.description}</ComboboxDescription>
      <ComboboxContent />
    </Combobox>
  );
}
