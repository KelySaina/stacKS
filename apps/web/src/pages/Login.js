import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center px-4 py-10", children: _jsxs("div", { className: "grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr]", children: [_jsxs("div", { className: "rounded-[36px] bg-ink p-8 text-white shadow-panel md:p-12", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.32em] text-white/50", children: "GED Platform" }), _jsx("h1", { className: "mt-4 font-display text-5xl font-bold leading-tight", children: "Secure document operations for every organization." }), _jsx("p", { className: "mt-6 max-w-xl text-lg text-white/72", children: "Centralize folders, versions, share links, and audit trails across multiple tenants without losing isolation." })] }), _jsxs(Card, { className: "p-8 md:p-10", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.24em] text-slate-400", children: "Welcome back" }), _jsx("h2", { className: "mt-2 font-display text-3xl font-bold text-ink", children: "Sign in" }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsx(Input, { value: email, onChange: (event) => setEmail(event.target.value), placeholder: "Email" }), _jsx(Input, { type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "Password" }), error ? _jsx("p", { className: "text-sm text-rose-600", children: error }) : null, _jsx(Button, { className: "w-full", disabled: busy, onClick: async () => {
                                        setError('');
                                        try {
                                            await login(email, password);
                                            const redirect = location.state?.from?.pathname ?? '/dashboard';
                                            navigate(redirect, { replace: true });
                                        }
                                        catch {
                                            setError('Authentication failed. Check the seeded credentials or API connectivity.');
                                        }
                                    }, children: busy ? 'Signing in...' : 'Sign in' })] }), _jsx("div", { className: "mt-6 rounded-2xl bg-sand px-4 py-3 text-sm text-slate-600", children: "Seeded admin credentials: admin@ged.local / admin123" })] })] }) }));
}
