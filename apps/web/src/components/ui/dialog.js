import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Dialog({ open, onOpenChange, trigger, title, description, children }) {
    return (_jsxs(DialogPrimitive.Root, { open: open, onOpenChange: onOpenChange, children: [trigger ? _jsx(DialogPrimitive.Trigger, { asChild: true, children: trigger }) : null, _jsxs(DialogPrimitive.Portal, { children: [_jsx(DialogPrimitive.Overlay, { className: "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm" }), _jsxs(DialogPrimitive.Content, { className: "fixed left-1/2 top-1/2 z-50 w-[min(92vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/70 bg-white p-6 shadow-panel", children: [_jsxs("div", { className: "mb-5 flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx(DialogPrimitive.Title, { className: "font-display text-2xl font-bold text-ink", children: title }), description ? (_jsx(DialogPrimitive.Description, { className: "mt-2 text-sm text-slate-500", children: description })) : null] }), _jsx(DialogPrimitive.Close, { className: cn('rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-ink'), children: _jsx(X, { className: "h-4 w-4" }) })] }), children] })] })] }));
}
