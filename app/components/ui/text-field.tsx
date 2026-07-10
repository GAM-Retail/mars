import * as React from 'react';
import { cn } from '~/lib/utils';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

interface TextFieldContextValue {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  validationState?: 'valid' | 'invalid';
  required?: boolean;
  disabled?: boolean;
}

const TextFieldContext = React.createContext<TextFieldContextValue>({});

function TextField({ children, ...props }: React.PropsWithChildren<TextFieldContextValue>) {
  return (
    <TextFieldContext.Provider value={props}>
      <div className="grid w-full items-center gap-1.5">{children}</div>
    </TextFieldContext.Provider>
  );
}

function useTextField() {
  const ctx = React.useContext(TextFieldContext);
  if (!ctx) throw new Error('TextField components must be used within a TextField');
  return ctx;
}

const TextFieldLabel = React.forwardRef<React.ComponentRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => {
    const ctx = useTextField();
    return <Label ref={ref} className={cn(className)} htmlFor={ctx.name} {...props} />;
  },
);
TextFieldLabel.displayName = 'TextFieldLabel';

const TextFieldInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const ctx = useTextField();
    return (
      <Input
        ref={ref}
        id={ctx.name}
        name={ctx.name}
        value={ctx.value}
        onChange={(e) => ctx.onChange?.(e.target.value)}
        required={ctx.required}
        disabled={ctx.disabled}
        data-invalid={ctx.validationState === 'invalid' ? true : undefined}
        className={cn(ctx.validationState === 'invalid' && 'border-destructive focus-visible:ring-destructive', className)}
        {...props}
      />
    );
  },
);
TextFieldInput.displayName = 'TextFieldInput';

const TextFieldTextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    const ctx = useTextField();
    return (
      <textarea
        ref={ref}
        id={ctx.name}
        name={ctx.name}
        value={ctx.value}
        onChange={(e) => ctx.onChange?.(e.target.value)}
        required={ctx.required}
        disabled={ctx.disabled}
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          ctx.validationState === 'invalid' && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        {...props}
      />
    );
  },
);
TextFieldTextArea.displayName = 'TextFieldTextArea';

const TextFieldDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const TextFieldErrorMessage = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-destructive', className)} {...props} />
);

export { TextField, TextFieldLabel, TextFieldInput, TextFieldTextArea, TextFieldDescription, TextFieldErrorMessage };
