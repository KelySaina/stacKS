import { Building2, ChevronsUpDown } from 'lucide-react';
import { useTenant } from '@/hooks/use-tenant';
import { cn } from '@/lib/utils';

export function TenantSwitcher() {
  const { tenants, currentTenantId, setCurrentTenantId } = useTenant();

  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-left shadow-sm">
      <span className="rounded-2xl bg-sky p-2 text-ink">
        <Building2 className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs uppercase tracking-[0.22em] text-slate-400">Tenant</span>
        <select
          className={cn('mt-1 w-full bg-transparent text-sm font-semibold text-ink outline-none')}
          value={currentTenantId ?? ''}
          onChange={(event) => setCurrentTenantId(event.target.value || null)}
        >
          {tenants.map((membership) => (
            <option key={membership.tenant.id} value={membership.tenant.id}>
              {membership.tenant.name} · {membership.role}
            </option>
          ))}
        </select>
      </span>
      <ChevronsUpDown className="h-4 w-4 text-slate-400" />
    </label>
  );
}