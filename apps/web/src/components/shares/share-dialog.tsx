import { useMemo, useState } from 'react';
import type { Document, Share } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function ShareDialog({
  document,
  open,
  onOpenChange,
  onCreate,
}: {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: { expiresAt: string; password?: string; maxDownloads?: number }) => Promise<Share>;
}) {
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={document ? `Share ${document.name}` : 'Share document'}
      description="Generate a public link with expiry and optional protection."
    >
      <div className="space-y-4">
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Expiry</span>
          <Input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
        </label>
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Password</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Optional" />
        </label>
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Max downloads</span>
          <Input type="number" min={1} value={maxDownloads} onChange={(event) => setMaxDownloads(event.target.value)} placeholder="Unlimited" />
        </label>
        {link ? (
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Share link</p>
            <p className="mt-2 break-all text-sm text-ink">{link}</p>
            <Button className="mt-3" variant="secondary" onClick={() => navigator.clipboard.writeText(link)}>
              Copy link
            </Button>
          </div>
        ) : null}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={submit} disabled={!document || submitting}>
            {submitting ? 'Generating...' : 'Create share'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}