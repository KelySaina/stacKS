import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatBytes } from '@/lib/utils';
export function TenantManager({ tenants, onCreate, onUpdate, onDelete, }) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [quota, setQuota] = useState('5368709120');
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "font-display text-2xl font-bold text-ink", children: "Create tenant" }), _jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-3", children: [_jsx(Input, { value: name, onChange: (event) => setName(event.target.value), placeholder: "Acme Corp" }), _jsx(Input, { value: slug, onChange: (event) => setSlug(event.target.value), placeholder: "acme-corp" }), _jsx(Input, { value: quota, onChange: (event) => setQuota(event.target.value), placeholder: "5368709120" })] }), _jsx(Button, { className: "mt-4", onClick: async () => {
                            await onCreate({ name, slug: slug || undefined, storageQuota: Number(quota) || undefined });
                            setName('');
                            setSlug('');
                        }, disabled: !name.trim(), children: "Create tenant" })] }), _jsx("div", { className: "grid gap-4 lg:grid-cols-2", children: tenants.map((tenant) => (_jsxs(Card, { className: "p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold text-ink", children: tenant.name }), _jsx("p", { className: "text-sm text-slate-500", children: tenant.slug })] }), _jsx(Button, { variant: "danger", onClick: () => onDelete(tenant.id), children: "Delete" })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Bucket" }), _jsx("p", { className: "mt-1 font-semibold text-ink", children: tenant.bucket })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Used" }), _jsx("p", { className: "mt-1 font-semibold text-ink", children: formatBytes(Number(tenant.storageUsed)) })] })] }), _jsx(Button, { className: "mt-4", variant: "ghost", onClick: () => onUpdate(tenant.id, { name: `${tenant.name} Updated` }), children: "Quick rename" })] }, tenant.id))) })] }));
}
