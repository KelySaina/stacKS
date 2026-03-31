import { useState } from 'react';
import type { Tenant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatBytes } from '@/lib/utils';

export function TenantManager({
  tenants,
  onCreate,
  onUpdate,
  onDelete,
}: {
  tenants: Tenant[];
  onCreate: (payload: { name: string; slug?: string; storageQuota?: number }) => Promise<void>;
  onUpdate: (tenantId: string, payload: { name?: string; storageQuota?: number }) => Promise<void>;
  onDelete: (tenantId: string) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [quota, setQuota] = useState('5368709120');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-display text-2xl font-bold text-ink">Create tenant</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Corp" />
          <Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="acme-corp" />
          <Input value={quota} onChange={(event) => setQuota(event.target.value)} placeholder="5368709120" />
        </div>
        <Button
          className="mt-4"
          onClick={async () => {
            await onCreate({ name, slug: slug || undefined, storageQuota: Number(quota) || undefined });
            setName('');
            setSlug('');
          }}
          disabled={!name.trim()}
        >
          Create tenant
        </Button>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-ink">{tenant.name}</p>
                <p className="text-sm text-slate-500">{tenant.slug}</p>
              </div>
              <Button variant="danger" onClick={() => onDelete(tenant.id)}>
                Delete
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Bucket</p>
                <p className="mt-1 font-semibold text-ink">{tenant.bucket}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Used</p>
                <p className="mt-1 font-semibold text-ink">{formatBytes(Number(tenant.storageUsed))}</p>
              </div>
            </div>
            <Button className="mt-4" variant="ghost" onClick={() => onUpdate(tenant.id, { name: `${tenant.name} Updated` })}>
              Quick rename
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}