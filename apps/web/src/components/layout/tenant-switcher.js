import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Building2, ChevronsUpDown } from 'lucide-react';
import { useTenant } from '@/hooks/use-tenant';
import { cn } from '@/lib/utils';
export function TenantSwitcher() {
    const { tenants, currentTenantId, setCurrentTenantId } = useTenant();
    return (_jsxs("label", { className: "flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-left shadow-sm", children: [_jsx("span", { className: "rounded-2xl bg-sky p-2 text-ink", children: _jsx(Building2, { className: "h-5 w-5" }) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block text-xs uppercase tracking-[0.22em] text-slate-400", children: "Tenant" }), _jsx("select", { className: cn('mt-1 w-full bg-transparent text-sm font-semibold text-ink outline-none'), value: currentTenantId ?? '', onChange: (event) => setCurrentTenantId(event.target.value || null), children: tenants.map((membership) => (_jsxs("option", { value: membership.tenant.id, children: [membership.tenant.name, " \u00B7 ", membership.role] }, membership.tenant.id))) })] }), _jsx(ChevronsUpDown, { className: "h-4 w-4 text-slate-400" })] }));
}
