import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@/lib/utils';
const variants = {
    primary: 'bg-ember text-white hover:bg-[#dd7300]',
    secondary: 'bg-moss text-white hover:bg-[#2f4f43]',
    ghost: 'bg-transparent text-ink hover:bg-black/5',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
};
export const Button = React.forwardRef(function Button({ className, variant = 'primary', type = 'button', ...props }, ref) {
    return (_jsx("button", { ref: ref, type: type, className: cn('inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60', variants[variant], className), ...props }));
});
