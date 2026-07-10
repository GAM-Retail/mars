import { useRef } from 'react';
import { Input } from '~/components/ui/input';
import { Clock3 } from 'lucide-react';
import { cn } from '~/lib/utils';

export default function InputTime({
  name,
  id,
  defaultValue,
  className,
  required = false,
}: Readonly<{
  name: string;
  id: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
}>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center">
      <Input
        ref={inputRef}
        id={id}
        name={name}
        type="time"
        required={required}
        defaultValue={defaultValue}
        className={cn('w-full [&::-webkit-calendar-picker-indicator]:hidden', className)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker?.()}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <Clock3 className="size-4" />
      </button>
    </div>
  );
}
