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
    queryFn: () => documentsApi.list(currentTenantId!),
    enabled: Boolean(currentTenantId),
  });
  const sharesQuery = useQuery({
    queryKey: ['dashboard-shares', currentTenantId],
    queryFn: () => sharesApi.list(currentTenantId!),
    enabled: Boolean(currentTenantId),
  });
  const auditQuery = useQuery({
    queryKey: ['dashboard-audit', currentTenantId],
    queryFn: () => auditApi.list(currentTenantId!),
    enabled: Boolean(currentTenantId),
  });

  const storageUsed = Number(currentTenant?.storageUsed ?? 0);
  const storageQuota = Number(currentTenant?.storageQuota ?? 0);
  const usageRatio = storageQuota ? Math.min(100, Math.round((storageUsed / storageQuota) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Documents</p>
          <p className="mt-3 text-4xl font-bold text-ink">{documentsQuery.data?.length ?? 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Active shares</p>
          <p className="mt-3 text-4xl font-bold text-ink">{sharesQuery.data?.length ?? 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Role</p>
          <p className="mt-3 text-2xl font-bold text-ink">{currentRole ?? 'N/A'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Storage used</p>
          <p className="mt-3 text-2xl font-bold text-ink">{formatBytes(storageUsed)}</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-ember" style={{ width: `${usageRatio}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-500">{usageRatio}% of {formatBytes(storageQuota)}</p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Recent activity</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">Audit stream</h2>
            </div>
            <Badge>{auditQuery.data?.length ?? 0} entries</Badge>
          </div>
          <div className="mt-6 space-y-3">
            {auditQuery.data?.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.action}</p>
                  <p className="text-sm text-slate-500">{item.user.firstName} {item.user.lastName} · {item.resource}</p>
                </div>
                <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Tenant overview</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">{currentTenant?.name ?? 'No tenant selected'}</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Slug</dt>
              <dd className="mt-1 font-semibold text-ink">{currentTenant?.slug ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Bucket</dt>
              <dd className="mt-1 font-semibold text-ink">{currentTenant?.bucket ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Created</dt>
              <dd className="mt-1 font-semibold text-ink">{formatDate(currentTenant?.createdAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}