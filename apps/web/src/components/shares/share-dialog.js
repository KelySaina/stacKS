import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
export function ShareDialog({ document, open, onOpenChange, onCreate, }) {
    const defaultExpiry = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().slice(0, 16);
    }, [document?.id]);
    const [expiresAt, setExpiresAt] = useState(defaultExpiry);
    const [password, setPassword] = useState('');
    const [maxDownloads, setMaxDownloads] = useState('');
    const [link, setLink] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const submit = async () => {
        if (!document) {
            return;
        }
        setSubmitting(true);
        try {
            const share = await onCreate({
                expiresAt: new Date(expiresAt).toISOString(),
                password: password || undefined,
                maxDownloads: maxDownloads ? Number(maxDownloads) : undefined,
            });
            setLink(`${window.location.origin}/public/share/${share.token}`);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, title: document ? `Share ${document.name}` : 'Share document', description: "Generate a public link with expiry and optional protection.", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "block space-y-2 text-sm font-medium text-ink", children: [_jsx("span", { children: "Expiry" }), _jsx(Input, { type: "datetime-local", value: expiresAt, onChange: (event) => setExpiresAt(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-medium text-ink", children: [_jsx("span", { children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "Optional" })] }), _jsxs("label", { className: "block space-y-2 text-sm font-medium text-ink", children: [_jsx("span", { children: "Max downloads" }), _jsx(Input, { type: "number", min: 1, value: maxDownloads, onChange: (event) => setMaxDownloads(event.target.value), placeholder: "Unlimited" })] }), link ? (_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Share link" }), _jsx("p", { className: "mt-2 break-all text-sm text-ink", children: link }), _jsx(Button, { className: "mt-3", variant: "secondary", onClick: () => navigator.clipboard.writeText(link), children: "Copy link" })] })) : null, _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Close" }), _jsx(Button, { onClick: submit, disabled: !document || submitting, children: submitting ? 'Generating...' : 'Create share' })] })] }) }));
}
