import { useState } from 'react';
import type { Role, TenantUsersItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const roles: Role[] = ['ADMIN', 'EDITOR', 'VIEWER'];

export function UserManager({
  users,
  onInvite,
  onUpdateRole,
  onRemove,
}: {
  users: TenantUsersItem[];
  onInvite: (payload: { email: string; firstName: string; lastName: string; role: Role }) => Promise<void>;
  onUpdateRole: (userId: string, role: Role) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
}) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'VIEWER' as Role });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-display text-2xl font-bold text-ink">Invite user</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="jane@acme.local" />
          <Input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} placeholder="Jane" />
          <Input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} placeholder="Doe" />
          <select className="rounded-2xl border border-[hsl(var(--border))] bg-white px-4 py-3" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Role }))}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <Button
          className="mt-4"
          onClick={async () => {
            await onInvite(form);
            setForm({ email: '', firstName: '', lastName: '', role: 'VIEWER' });
          }}
          disabled={!form.email.trim() || !form.firstName.trim() || !form.lastName.trim()}
        >
          Invite user
        </Button>
      </Card>
      <div className="space-y-4">
        {users.map((entry) => (
          <Card key={entry.id} className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-ink">{entry.user.firstName} {entry.user.lastName}</p>
                <p className="text-sm text-slate-500">{entry.user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select className="rounded-2xl border border-[hsl(var(--border))] bg-white px-4 py-2" value={entry.role} onChange={(event) => onUpdateRole(entry.userId, event.target.value as Role)}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <Button variant="danger" onClick={() => onRemove(entry.userId)}>
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}