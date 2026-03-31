import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-[hsl(var(--border))] bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-ember focus:ring-4 focus:ring-orange-100',
          className,
        )}
        {...props}
      />
    );
  },
);