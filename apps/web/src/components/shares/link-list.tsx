import { Copy, Link2, Trash2 } from 'lucide-react';
import type { Share } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export function LinkList({ shares, onRevoke }: { shares: Share[]; onRevoke: (shareId: string) => Promise<void> }) {
  return (
    <div className="space-y-4">
      {shares.length ? (
        shares.map((share) => {
          const link = `${window.location.origin}/public/share/${share.token}`;
          return (
            <Card key={share.id} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-ember" />
                    <p className="truncate text-base font-semibold text-ink">{share.document?.name ?? 'Shared document'}</p>
                    <Badge>{share.isActive ? 'Active' : 'Revoked'}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Expires {formatDate(share.expiresAt)} · Downloads {share.downloadCount}{share.maxDownloads ? `/${share.maxDownloads}` : ''}</p>
                  <p className="mt-2 truncate text-sm text-slate-600">{link}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => navigator.clipboard.writeText(link)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="danger" onClick={() => onRevoke(share.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <Card className="p-6 text-sm text-slate-500">No active share links for this tenant.</Card>
      )}
    </div>
  );
}