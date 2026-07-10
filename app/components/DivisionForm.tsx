import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export const DivisionSchema = v.object({
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
});

type DivisionFormData = v.InferInput<typeof DivisionSchema>;

type DivisionFormProps = {
  onSubmit: (data: DivisionFormData) => void;
  initialValues?: Partial<DivisionFormData>;
  isSubmitting?: boolean;
};

export default function DivisionForm(props: Readonly<DivisionFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DivisionFormData>({
    resolver: valibotResolver(DivisionSchema),
    defaultValues: props.initialValues,
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="flex flex-col gap-4 max-w-md">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} placeholder="Home name" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={props.isSubmitting} className="w-fit">
        {props.isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
