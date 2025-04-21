import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

const InputGroup = React.forwardRef<HTMLInputElement, InputProps>(({ className, children, ...props }, ref) => {
  return (
    <div className={cn('relative flex w-full items-end justify-center', className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
InputGroup.displayName = 'InputGroup';

const InputGroupRight = React.forwardRef<HTMLInputElement, InputProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn('flex items-center h-10 px-2 border border-border border-l-0 rounded-md', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
InputGroupRight.displayName = 'InputGroupRight';

export { Input, InputGroup, InputGroupRight };
