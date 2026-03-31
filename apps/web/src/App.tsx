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
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RequireAuth() {
  const location = useLocation();
  const { user, initialized } = useAuth();

  if (!initialized) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <ProtectedLayout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/public/share/:token" element={<PublicSharePage />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/shares" element={<SharedLinksPage />} />
        <Route path="/audit" element={<AuditLogPage />} />
        <Route path="/admin/tenants" element={<TenantsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}