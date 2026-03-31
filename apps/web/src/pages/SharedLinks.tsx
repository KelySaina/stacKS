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
    queryFn: () => sharesApi.list(currentTenantId!),
    enabled: Boolean(currentTenantId),
  });
  const revokeMutation = useMutation({
    mutationFn: (shareId: string) => sharesApi.revoke(currentTenantId!, shareId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shares', currentTenantId] }),
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Share management</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">Public links</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor live share tokens, copy links for handoff, and revoke access when a window closes.</p>
      </Card>
      <LinkList shares={sharesQuery.data ?? []} onRevoke={(shareId) => revokeMutation.mutateAsync(shareId).then(() => undefined)} />
    </div>
  );
}