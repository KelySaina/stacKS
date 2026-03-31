import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Card({ className, ...props }) {
    return _jsx("div", { className: cn('panel-surface rounded-[28px] border border-white/60 shadow-panel', className), ...props });
}
