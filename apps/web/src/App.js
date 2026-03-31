import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { AppShell } from '@/components/layout/app-shell';
import { AuditLogPage } from '@/pages/AuditLog';
import { DashboardPage } from '@/pages/Dashboard';
import { DocumentsPage } from '@/pages/Documents';
import { LoginPage } from '@/pages/Login';
import { PublicSharePage } from '@/pages/PublicShare';
import { SharedLinksPage } from '@/pages/SharedLinks';
import { TenantsPage } from '@/pages/admin/Tenants';
import { UsersPage } from '@/pages/admin/Users';
function ProtectedLayout() {
    return (_jsx(AppShell, { children: _jsx(Outlet, {}) }));
}
function RequireAuth() {
    const location = useLocation();
    const { user, initialized } = useAuth();
    if (!initialized) {
        return _jsx("div", { className: "flex min-h-screen items-center justify-center text-sm text-slate-500", children: "Loading session..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    return _jsx(ProtectedLayout, {});
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/public/share/:token", element: _jsx(PublicSharePage, {}) }), _jsxs(Route, { element: _jsx(RequireAuth, {}), children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/documents", element: _jsx(DocumentsPage, {}) }), _jsx(Route, { path: "/shares", element: _jsx(SharedLinksPage, {}) }), _jsx(Route, { path: "/audit", element: _jsx(AuditLogPage, {}) }), _jsx(Route, { path: "/admin/tenants", element: _jsx(TenantsPage, {}) }), _jsx(Route, { path: "/admin/users", element: _jsx(UsersPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
