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
    queryFn: () =>
      auditApi.list(currentTenantId!, {
        action: filters.action || undefined,
        userId: filters.userId || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      }),
    enabled: Boolean(currentTenantId),
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Audit</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">Activity log</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Input value={filters.action} onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))} placeholder="Action" />
          <Input value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))} placeholder="User ID" />
          <Input type="date" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} />
          <Input type="date" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} />
        </div>
      </Card>
      <div className="space-y-4">
        {query.data?.map((entry) => (
          <Card key={entry.id} className="p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base font-semibold text-ink">{entry.action}</p>
                <p className="text-sm text-slate-500">{entry.user.firstName} {entry.user.lastName} · {entry.user.email}</p>
              </div>
              <p className="text-sm text-slate-400">{formatDate(entry.createdAt)}</p>
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Resource: {entry.resource}{entry.resourceId ? ` · ${entry.resourceId}` : ''}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}