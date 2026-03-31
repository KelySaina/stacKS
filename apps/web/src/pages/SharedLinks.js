import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sharesApi } from '@/lib/api';
import { useTenant } from '@/hooks/use-tenant';
import { LinkList } from '@/components/shares/link-list';
import { Card } from '@/components/ui/card';
export function SharedLinksPage() {
    const { currentTenantId } = useTenant();
    const queryClient = useQueryClient();
    const sharesQuery = useQuery({
        queryKey: ['shares', currentTenantId],
        queryFn: () => sharesApi.list(currentTenantId),
        enabled: Boolean(currentTenantId),
    });
    const revokeMutation = useMutation({
        mutationFn: (shareId) => sharesApi.revoke(currentTenantId, shareId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shares', currentTenantId] }),
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Share management" }), _jsx("h2", { className: "mt-2 font-display text-2xl font-bold text-ink", children: "Public links" }), _jsx("p", { className: "mt-2 max-w-2xl text-sm text-slate-500", children: "Monitor live share tokens, copy links for handoff, and revoke access when a window closes." })] }), _jsx(LinkList, { shares: sharesQuery.data ?? [], onRevoke: (shareId) => revokeMutation.mutateAsync(shareId).then(() => undefined) })] }));
}
