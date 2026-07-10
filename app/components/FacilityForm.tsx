import { useState } from 'react';
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from '~/components/ui/text-field';
import { Button } from '~/components/ui/button';

interface FacilityFormValues {
  name: string;
  description?: string;
}

interface FacilityFormProps {
  onSubmit: (data: FacilityFormValues) => void;
  initialValues?: Partial<FacilityFormValues>;
}

export default function FacilityForm({ onSubmit, initialValues }: Readonly<FacilityFormProps>) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        name="name"
        value={name}
        onChange={setName}
        validationState={error ? 'invalid' : 'valid'}
        required
      >
        <TextFieldLabel>Name</TextFieldLabel>
        <TextFieldInput />
        <TextFieldErrorMessage>{error}</TextFieldErrorMessage>
      </TextField>
      <TextField name="description" value={description} onChange={setDescription}>
        <TextFieldLabel>Description</TextFieldLabel>
        <TextFieldTextArea />
      </TextField>
      <Button type="submit">Submit</Button>
    </form>
  );
}
