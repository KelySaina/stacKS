import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { auditApi, documentsApi, sharesApi } from '@/lib/api';
import { useTenant } from '@/hooks/use-tenant';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatBytes, formatDate } from '@/lib/utils';
export function DashboardPage() {
    const { currentTenant, currentTenantId, currentRole } = useTenant();
    const documentsQuery = useQuery({
        queryKey: ['dashboard-documents', currentTenantId],
        queryFn: () => documentsApi.list(currentTenantId),
        enabled: Boolean(currentTenantId),
    });
    const sharesQuery = useQuery({
        queryKey: ['dashboard-shares', currentTenantId],
        queryFn: () => sharesApi.list(currentTenantId),
        enabled: Boolean(currentTenantId),
    });
    const auditQuery = useQuery({
        queryKey: ['dashboard-audit', currentTenantId],
        queryFn: () => auditApi.list(currentTenantId),
        enabled: Boolean(currentTenantId),
    });
    const storageUsed = Number(currentTenant?.storageUsed ?? 0);
    const storageQuota = Number(currentTenant?.storageQuota ?? 0);
    const usageRatio = storageQuota ? Math.min(100, Math.round((storageUsed / storageQuota) * 100)) : 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-4 xl:grid-cols-4 md:grid-cols-2", children: [_jsxs(Card, { className: "p-5", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Documents" }), _jsx("p", { className: "mt-3 text-4xl font-bold text-ink", children: documentsQuery.data?.length ?? 0 })] }), _jsxs(Card, { className: "p-5", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Active shares" }), _jsx("p", { className: "mt-3 text-4xl font-bold text-ink", children: sharesQuery.data?.length ?? 0 })] }), _jsxs(Card, { className: "p-5", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Role" }), _jsx("p", { className: "mt-3 text-2xl font-bold text-ink", children: currentRole ?? 'N/A' })] }), _jsxs(Card, { className: "p-5", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Storage used" }), _jsx("p", { className: "mt-3 text-2xl font-bold text-ink", children: formatBytes(storageUsed) }), _jsx("div", { className: "mt-4 h-2 rounded-full bg-slate-100", children: _jsx("div", { className: "h-2 rounded-full bg-ember", style: { width: `${usageRatio}%` } }) }), _jsxs("p", { className: "mt-2 text-sm text-slate-500", children: [usageRatio, "% of ", formatBytes(storageQuota)] })] })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.2fr,0.8fr]", children: [_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Recent activity" }), _jsx("h2", { className: "mt-2 font-display text-2xl font-bold text-ink", children: "Audit stream" })] }), _jsxs(Badge, { children: [auditQuery.data?.length ?? 0, " entries"] })] }), _jsx("div", { className: "mt-6 space-y-3", children: auditQuery.data?.slice(0, 8).map((item) => (_jsxs("div", { className: "flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-ink", children: item.action }), _jsxs("p", { className: "text-sm text-slate-500", children: [item.user.firstName, " ", item.user.lastName, " \u00B7 ", item.resource] })] }), _jsx("p", { className: "text-xs text-slate-400", children: formatDate(item.createdAt) })] }, item.id))) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Tenant overview" }), _jsx("h2", { className: "mt-2 font-display text-2xl font-bold text-ink", children: currentTenant?.name ?? 'No tenant selected' }), _jsxs("dl", { className: "mt-6 space-y-4 text-sm", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-slate-400", children: "Slug" }), _jsx("dd", { className: "mt-1 font-semibold text-ink", children: currentTenant?.slug ?? 'N/A' })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-slate-400", children: "Bucket" }), _jsx("dd", { className: "mt-1 font-semibold text-ink", children: currentTenant?.bucket ?? 'N/A' })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-slate-400", children: "Created" }), _jsx("dd", { className: "mt-1 font-semibold text-ink", children: formatDate(currentTenant?.createdAt) })] })] })] })] })] }));
}
