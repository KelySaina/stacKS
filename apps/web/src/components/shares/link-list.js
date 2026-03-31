import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Copy, Link2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
export function LinkList({ shares, onRevoke }) {
    return (_jsx("div", { className: "space-y-4", children: shares.length ? (shares.map((share) => {
            const link = `${window.location.origin}/public/share/${share.token}`;
            return (_jsx(Card, { className: "p-5", children: _jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link2, { className: "h-4 w-4 text-ember" }), _jsx("p", { className: "truncate text-base font-semibold text-ink", children: share.document?.name ?? 'Shared document' }), _jsx(Badge, { children: share.isActive ? 'Active' : 'Revoked' })] }), _jsxs("p", { className: "mt-2 text-sm text-slate-500", children: ["Expires ", formatDate(share.expiresAt), " \u00B7 Downloads ", share.downloadCount, share.maxDownloads ? `/${share.maxDownloads}` : ''] }), _jsx("p", { className: "mt-2 truncate text-sm text-slate-600", children: link })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigator.clipboard.writeText(link), children: [_jsx(Copy, { className: "mr-2 h-4 w-4" }), "Copy"] }), _jsxs(Button, { variant: "danger", onClick: () => onRevoke(share.id), children: [_jsx(Trash2, { className: "mr-2 h-4 w-4" }), "Revoke"] })] })] }) }, share.id));
        })) : (_jsx(Card, { className: "p-6 text-sm text-slate-500", children: "No active share links for this tenant." })) }));
}
