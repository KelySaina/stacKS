import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Download, Lock } from 'lucide-react';
import { sharesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatBytes, formatDate } from '@/lib/utils';
export function PublicSharePage() {
    const { token = '' } = useParams();
    const [password, setPassword] = useState('');
    const accessQuery = useQuery({
        queryKey: ['public-share', token, password],
        queryFn: () => sharesApi.access(token, password || undefined),
        enabled: Boolean(token),
        retry: false,
    });
    const downloadMutation = useMutation({
        mutationFn: () => sharesApi.download(token, { password: password || undefined }),
        onSuccess: (payload) => {
            window.open(payload.url, '_blank', 'noopener,noreferrer');
        },
    });
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center px-4 py-10", children: _jsxs(Card, { className: "w-full max-w-xl p-8 md:p-10", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.24em] text-slate-400", children: "Public share" }), _jsx("h1", { className: "mt-2 font-display text-3xl font-bold text-ink", children: "Access shared document" }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("label", { className: "block space-y-2 text-sm font-medium text-ink", children: [_jsx("span", { children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), _jsx(Input, { className: "pl-11", type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "Leave empty if the link is not protected" })] })] }), accessQuery.error ? (_jsx("div", { className: "rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700", children: "Unable to access this share. The link may be expired, revoked, or password-protected." })) : null, accessQuery.data ? (_jsxs("div", { className: "space-y-4 rounded-[28px] bg-slate-50 p-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xl font-semibold text-ink", children: accessQuery.data.document.name }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: accessQuery.data.document.mimeType })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Size" }), _jsx("p", { className: "mt-1 font-semibold text-ink", children: formatBytes(Number(accessQuery.data.document.size)) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Expires" }), _jsx("p", { className: "mt-1 font-semibold text-ink", children: formatDate(accessQuery.data.share.expiresAt) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Downloads" }), _jsxs("p", { className: "mt-1 font-semibold text-ink", children: [accessQuery.data.share.downloadCount, accessQuery.data.share.maxDownloads ? `/${accessQuery.data.share.maxDownloads}` : ''] })] })] }), _jsxs(Button, { className: "w-full", onClick: () => downloadMutation.mutate(), disabled: downloadMutation.isPending, children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), downloadMutation.isPending ? 'Preparing download...' : 'Download document'] })] })) : null] })] }) }));
}
