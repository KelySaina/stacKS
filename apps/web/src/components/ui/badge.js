import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Badge({ className, ...props }) {
    return (_jsx("span", { className: cn('inline-flex items-center rounded-full bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink', className), ...props }));
}
