import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Download, Lock } from 'lucide-react';
import { sharesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatBytes, formatDate } from '@/lib/utils';

export function PublicSharePage() {
  const { token = '' } = useParams();
  const [password, setPassword] = useState('');
  const accessQuery = useQuery({
    queryKey: ['public-share', token, password],
    queryFn: () => sharesApi.access(token, password || undefined),
    enabled: Boolean(token),
    retry: false,
  });
  const downloadMutation = useMutation({
    mutationFn: () => sharesApi.download(token, { password: password || undefined }),
    onSuccess: (payload) => {
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Public share</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Access shared document</h1>
        <div className="mt-6 space-y-4">
          <label className="block space-y-2 text-sm font-medium text-ink">
            <span>Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-11" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Leave empty if the link is not protected" />
            </div>
          </label>
          {accessQuery.error ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Unable to access this share. The link may be expired, revoked, or password-protected.
            </div>
          ) : null}
          {accessQuery.data ? (
            <div className="space-y-4 rounded-[28px] bg-slate-50 p-5">
              <div>
                <p className="text-xl font-semibold text-ink">{accessQuery.data.document.name}</p>
                <p className="mt-1 text-sm text-slate-500">{accessQuery.data.document.mimeType}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Size</p>
                  <p className="mt-1 font-semibold text-ink">{formatBytes(Number(accessQuery.data.document.size))}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Expires</p>
                  <p className="mt-1 font-semibold text-ink">{formatDate(accessQuery.data.share.expiresAt)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Downloads</p>
                  <p className="mt-1 font-semibold text-ink">{accessQuery.data.share.downloadCount}{accessQuery.data.share.maxDownloads ? `/${accessQuery.data.share.maxDownloads}` : ''}</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => downloadMutation.mutate()} disabled={downloadMutation.isPending}>
                <Download className="mr-2 h-4 w-4" />
                {downloadMutation.isPending ? 'Preparing download...' : 'Download document'}
              </Button>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}