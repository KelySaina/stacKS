import { Download, History, Share2, Trash2 } from 'lucide-react';
import type { Document } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatBytes, formatDate } from '@/lib/utils';

export function DocumentCard({
  document,
  onShare,
  onDownload,
  onDelete,
  onViewVersions,
}: {
  document: Document;
  onShare: (document: Document) => void;
  onDownload: (document: Document) => void;
  onDelete: (document: Document) => void;
  onViewVersions: (document: Document) => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-ink">{document.name}</p>
          <p className="mt-1 text-sm text-slate-500">{document.folder?.path ?? 'Root'}</p>
        </div>
        <Badge>v{document.version}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Size</p>
          <p className="mt-1 font-semibold text-ink">{formatBytes(Number(document.size))}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Updated</p>
          <p className="mt-1 font-semibold text-ink">{formatDate(document.updatedAt)}</p>
        </div>
      </div>
      {document.tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {document.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => onDownload(document)}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="ghost" onClick={() => onShare(document)}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="ghost" onClick={() => onViewVersions(document)}>
          <History className="mr-2 h-4 w-4" />
          Versions
        </Button>
        <Button variant="danger" onClick={() => onDelete(document)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}