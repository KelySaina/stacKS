import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentsApi, sharesApi } from '@/lib/api';
import { useDocuments } from '@/hooks/use-documents';
import { useTenant } from '@/hooks/use-tenant';
import type { Document } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocumentCard } from '@/components/documents/document-card';
import { FileExplorer } from '@/components/documents/file-explorer';
import { UploadDialog } from '@/components/documents/upload-dialog';
import { ShareDialog } from '@/components/shares/share-dialog';
import { Input } from '@/components/ui/input';
import { formatBytes, formatDate } from '@/lib/utils';

export function DocumentsPage() {
  const { currentTenantId } = useTenant();
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [shareDocument, setShareDocument] = useState<Document | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [versionsDocument, setVersionsDocument] = useState<Document | null>(null);
  const documents = useDocuments(currentTenantId, activeFolderId);
  const versionsQuery = useQuery({
    queryKey: ['document-versions', currentTenantId, versionsDocument?.id],
    queryFn: () => documentsApi.versions(currentTenantId!, versionsDocument!.id),
    enabled: Boolean(currentTenantId && versionsDocument?.id),
  });

  const tree = documents.foldersQuery.data?.tree ?? [];
  const flatFolders = documents.foldersQuery.data?.items ?? [];
  const items = useMemo(() => documents.documentsQuery.data ?? [], [documents.documentsQuery.data]);

  return (
    <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
      <FileExplorer
        folders={tree}
        activeFolderId={activeFolderId}
        onSelect={setActiveFolderId}
        onCreateFolder={async () => {
          const trimmed = folderName.trim();
          if (!trimmed || !currentTenantId) {
            return;
          }
          await documents.createFolderMutation.mutateAsync({ name: trimmed, parentId: activeFolderId });
          setFolderName('');
        }}
      />
      <div className="space-y-6">
        <Card className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Document operations</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">Explorer workspace</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input value={folderName} onChange={(event) => setFolderName(event.target.value)} placeholder="New folder name" />
              <Button onClick={() => setUploadOpen(true)}>Upload file</Button>
            </div>
          </div>
        </Card>
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onShare={setShareDocument}
              onDownload={async (item) => {
                const response = await documentsApi.download(currentTenantId!, item.id);
                window.open(response.url, '_blank', 'noopener,noreferrer');
              }}
              onDelete={async (item) => {
                await documentsApi.remove(currentTenantId!, item.id);
                await documents.refresh();
              }}
              onViewVersions={setVersionsDocument}
            />
          ))}
          {!items.length ? <Card className="p-8 text-sm text-slate-500 xl:col-span-2">No documents found in this folder.</Card> : null}
        </div>
        {versionsDocument ? (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Versions</p>
                <h3 className="mt-2 text-xl font-bold text-ink">{versionsDocument.name}</h3>
              </div>
              <Button variant="ghost" onClick={() => setVersionsDocument(null)}>
                Close
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {versionsQuery.data?.map((version) => (
                <div key={version.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-ink">Version {version.version}</p>
                    <p className="text-slate-500">{formatDate(version.createdAt)}</p>
                  </div>
                  <p className="font-semibold text-ink">{formatBytes(Number(version.size))}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folders={flatFolders}
        onUpload={async (payload) => {
          await documents.uploadMutation.mutateAsync(payload);
        }}
      />
      <ShareDialog
        document={shareDocument}
        open={Boolean(shareDocument)}
        onOpenChange={(open) => {
          if (!open) {
            setShareDocument(null);
          }
        }}
        onCreate={(payload) => sharesApi.create(currentTenantId!, shareDocument!.id, payload)}
      />
    </div>
  );
}