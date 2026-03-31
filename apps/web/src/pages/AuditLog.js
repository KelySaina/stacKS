import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/lib/api';
import { useTenant } from '@/hooks/use-tenant';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
export function AuditLogPage() {
    const { currentTenantId } = useTenant();
    const [filters, setFilters] = useState({ action: '', userId: '', from: '', to: '' });
    const query = useQuery({
        queryKey: ['audit', currentTenantId, filters],
        queryFn: () => auditApi.list(currentTenantId, {
            action: filters.action || undefined,
            userId: filters.userId || undefined,
            from: filters.from || undefined,
            to: filters.to || undefined,
        }),
        enabled: Boolean(currentTenantId),
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Audit" }), _jsx("h2", { className: "mt-2 font-display text-2xl font-bold text-ink", children: "Activity log" }), _jsxs("div", { className: "mt-5 grid gap-3 md:grid-cols-4", children: [_jsx(Input, { value: filters.action, onChange: (event) => setFilters((current) => ({ ...current, action: event.target.value })), placeholder: "Action" }), _jsx(Input, { value: filters.userId, onChange: (event) => setFilters((current) => ({ ...current, userId: event.target.value })), placeholder: "User ID" }), _jsx(Input, { type: "date", value: filters.from, onChange: (event) => setFilters((current) => ({ ...current, from: event.target.value })) }), _jsx(Input, { type: "date", value: filters.to, onChange: (event) => setFilters((current) => ({ ...current, to: event.target.value })) })] })] }), _jsx("div", { className: "space-y-4", children: query.data?.map((entry) => (_jsxs(Card, { className: "p-5", children: [_jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-ink", children: entry.action }), _jsxs("p", { className: "text-sm text-slate-500", children: [entry.user.firstName, " ", entry.user.lastName, " \u00B7 ", entry.user.email] })] }), _jsx("p", { className: "text-sm text-slate-400", children: formatDate(entry.createdAt) })] }), _jsxs("div", { className: "mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600", children: ["Resource: ", entry.resource, entry.resourceId ? ` · ${entry.resourceId}` : ''] })] }, entry.id))) })] }));
}
