import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function AppShell({ children }) {
    const { user, logout } = useAuth();
    const { currentTenant, currentRole } = useTenant();
    return (_jsxs("div", { className: "app-shell-grid min-h-screen", children: [_jsxs("aside", { className: "border-r border-white/50 bg-ink px-6 py-8 text-white", children: [_jsxs(Link, { to: "/dashboard", className: "mb-8 block", children: [_jsx("p", { className: "font-display text-3xl font-bold tracking-tight", children: "ged" }), _jsx("p", { className: "mt-1 text-sm text-white/70", children: "Multi-tenant document command center" })] }), _jsx(TenantSwitcher, {}), _jsx("nav", { className: "mt-8 space-y-2", children: items.map((item) => (_jsxs(NavLink, { to: item.to, className: ({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-white text-ink' : 'text-white/78 hover:bg-white/10'}`, children: [_jsx(item.icon, { className: "h-4 w-4" }), _jsx("span", { children: item.label })] }, item.to))) }), _jsx("div", { className: "mt-auto pt-10", children: _jsxs("div", { className: "rounded-[24px] bg-white/10 p-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-ink", children: initials(user?.firstName, user?.lastName) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "truncate text-sm font-semibold", children: [user?.firstName, " ", user?.lastName] }), _jsx("p", { className: "truncate text-xs text-white/70", children: user?.email })] })] }), _jsxs("div", { className: "mt-4 rounded-2xl bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/70", children: [currentTenant?.name ?? 'No tenant', " \u00B7 ", currentRole ?? 'Guest'] }), _jsxs(Button, { className: "mt-4 w-full", variant: "secondary", onClick: logout, children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"] })] }) })] }), _jsxs("main", { className: "min-w-0 px-5 py-5 md:px-8 md:py-8", children: [_jsxs("div", { className: "mb-8 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/50 px-6 py-6 shadow-panel md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "Electronic document management" }), _jsx("h1", { className: "mt-2 font-display text-4xl font-bold text-ink", children: "Operational control for every tenant" })] }), _jsxs("div", { className: "rounded-[24px] bg-ink px-5 py-4 text-sm text-white", children: [_jsx("p", { className: "text-white/60", children: "Active workspace" }), _jsx("p", { className: "mt-1 text-lg font-semibold", children: currentTenant?.name ?? 'Select a tenant' })] })] }), children] })] }));
}
