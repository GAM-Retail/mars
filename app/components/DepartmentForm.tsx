import { useState } from 'react';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';

export interface DepartmentFormValues {
  name: string;
}

type DepartmentFormProps = {
  onSubmit: (data: DepartmentFormValues) => void | Promise<void>;
  initialValues?: Partial<DepartmentFormValues>;
  isSubmitting?: boolean;
};

export default function DepartmentForm({
  onSubmit,
  initialValues,
  isSubmitting,
}: Readonly<DepartmentFormProps>) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    setError('');
    onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        name="name"
        value={name}
        onChange={(v) => {
          setName(v);
          setError('');
        }}
        validationState={error ? 'invalid' : 'valid'}
        required
      >
        <TextFieldLabel>Name</TextFieldLabel>
        <TextFieldInput />
        <TextFieldErrorMessage>{error}</TextFieldErrorMessage>
      </TextField>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
