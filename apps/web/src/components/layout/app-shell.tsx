import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ClipboardList, Files, FolderKanban, Link2, LogOut, Shield, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { initials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TenantSwitcher } from './tenant-switcher';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: FolderKanban },
  { to: '/documents', label: 'Documents', icon: Files },
  { to: '/shares', label: 'Shared links', icon: Link2 },
  { to: '/audit', label: 'Audit log', icon: ClipboardList },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/tenants', label: 'Tenants', icon: Shield },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { currentTenant, currentRole } = useTenant();

  return (
    <div className="app-shell-grid min-h-screen">
      <aside className="border-r border-white/50 bg-ink px-6 py-8 text-white">
        <Link to="/dashboard" className="mb-8 block">
          <p className="font-display text-3xl font-bold tracking-tight">ged</p>
          <p className="mt-1 text-sm text-white/70">Multi-tenant document command center</p>
        </Link>
        <TenantSwitcher />
        <nav className="mt-8 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-white text-ink' : 'text-white/78 hover:bg-white/10'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <div className="rounded-[24px] bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-ink">
                {initials(user?.firstName, user?.lastName)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-white/70">{user?.email}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/70">
              {currentTenant?.name ?? 'No tenant'} · {currentRole ?? 'Guest'}
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-5 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/50 px-6 py-6 shadow-panel md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Electronic document management</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink">Operational control for every tenant</h1>
          </div>
          <div className="rounded-[24px] bg-ink px-5 py-4 text-sm text-white">
            <p className="text-white/60">Active workspace</p>
            <p className="mt-1 text-lg font-semibold">{currentTenant?.name ?? 'Select a tenant'}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}