import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, busy } = useAuth();
  const [email, setEmail] = useState('admin@ged.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[36px] bg-ink p-8 text-white shadow-panel md:p-12">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">GED Platform</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight">Secure document operations for every organization.</h1>
          <p className="mt-6 max-w-xl text-lg text-white/72">
            Centralize folders, versions, share links, and audit trails across multiple tenants without losing isolation.
          </p>
        </div>
        <Card className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Sign in</h2>
          <div className="mt-6 space-y-4">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button
              className="w-full"
              disabled={busy}
              onClick={async () => {
                setError('');
                try {
                  await login(email, password);
                  const redirect = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';
                  navigate(redirect, { replace: true });
                } catch {
                  setError('Authentication failed. Check the seeded credentials or API connectivity.');
                }
              }}
            >
              {busy ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
          <div className="mt-6 rounded-2xl bg-sand px-4 py-3 text-sm text-slate-600">
            Seeded admin credentials: admin@ged.local / admin123
          </div>
        </Card>
      </div>
    </div>
  );
}