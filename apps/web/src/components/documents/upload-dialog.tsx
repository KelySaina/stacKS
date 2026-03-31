import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import type { Folder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function UploadDialog({
  open,
  onOpenChange,
  folders,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Folder[];
  onUpload: (input: { file: File; folderId?: string; tags?: string[] }) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!file) {
      return;
    }
    setSubmitting(true);
    try {
      await onUpload({
        file,
        folderId: folderId || undefined,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setFile(null);
      setFolderId('');
      setTags('');
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Upload document"
      description="Drop a file into the active tenant and route it to a folder if needed."
    >
      <div className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <UploadCloud className="mb-4 h-10 w-10 text-ember" />
          <p className="text-base font-semibold text-ink">Choose a file to upload</p>
          <p className="mt-2 text-sm text-slate-500">PDF, image, spreadsheet, or any office document.</p>
          <input className="hidden" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          {file ? <p className="mt-4 rounded-full bg-white px-3 py-1 text-sm text-ink">{file.name}</p> : null}
        </label>
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Folder</span>
          <select className="w-full rounded-2xl border border-[hsl(var(--border))] bg-white px-4 py-3" value={folderId} onChange={(event) => setFolderId(event.target.value)}>
            <option value="">Root</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.path}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Tags</span>
          <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="invoice, signed, hr" />
        </label>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!file || submitting}>
            {submitting ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}