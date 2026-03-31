import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentsApi, sharesApi } from '@/lib/api';
import { useDocuments } from '@/hooks/use-documents';
import { useTenant } from '@/hooks/use-tenant';
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
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [shareDocument, setShareDocument] = useState(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [versionsDocument, setVersionsDocument] = useState(null);
    const documents = useDocuments(currentTenantId, activeFolderId);
    const versionsQuery = useQuery({
        queryKey: ['document-versions', currentTenantId, versionsDocument?.id],
        queryFn: () => documentsApi.versions(currentTenantId, versionsDocument.id),
        enabled: Boolean(currentTenantId && versionsDocument?.id),
    });
    const tree = documents.foldersQuery.data?.tree ?? [];
    const flatFolders = documents.foldersQuery.data?.items ?? [];
    const items = useMemo(() => documents.documentsQuery.data ?? [], [documents.documentsQuery.data]);
    return (_jsxs("div", { className: "grid gap-6 xl:grid-cols-[320px,1fr]", children: [_jsx(FileExplorer, { folders: tree, activeFolderId: activeFolderId, onSelect: setActiveFolderId, onCreateFolder: async () => {
                    const trimmed = folderName.trim();
                    if (!trimmed || !currentTenantId) {
                        return;
                    }
                    await documents.createFolderMutation.mutateAsync({ name: trimmed, parentId: activeFolderId });
                    setFolderName('');
                } }), _jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "p-5", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Document operations" }), _jsx("h2", { className: "mt-2 font-display text-2xl font-bold text-ink", children: "Explorer workspace" })] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [_jsx(Input, { value: folderName, onChange: (event) => setFolderName(event.target.value), placeholder: "New folder name" }), _jsx(Button, { onClick: () => setUploadOpen(true), children: "Upload file" })] })] }) }), _jsxs("div", { className: "grid gap-4 xl:grid-cols-2", children: [items.map((document) => (_jsx(DocumentCard, { document: document, onShare: setShareDocument, onDownload: async (item) => {
                                    const response = await documentsApi.download(currentTenantId, item.id);
                                    window.open(response.url, '_blank', 'noopener,noreferrer');
                                }, onDelete: async (item) => {
                                    await documentsApi.remove(currentTenantId, item.id);
                                    await documents.refresh();
                                }, onViewVersions: setVersionsDocument }, document.id))), !items.length ? _jsx(Card, { className: "p-8 text-sm text-slate-500 xl:col-span-2", children: "No documents found in this folder." }) : null] }), versionsDocument ? (_jsxs(Card, { className: "p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-slate-400", children: "Versions" }), _jsx("h3", { className: "mt-2 text-xl font-bold text-ink", children: versionsDocument.name })] }), _jsx(Button, { variant: "ghost", onClick: () => setVersionsDocument(null), children: "Close" })] }), _jsx("div", { className: "mt-4 space-y-3", children: versionsQuery.data?.map((version) => (_jsxs("div", { className: "flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-ink", children: ["Version ", version.version] }), _jsx("p", { className: "text-slate-500", children: formatDate(version.createdAt) })] }), _jsx("p", { className: "font-semibold text-ink", children: formatBytes(Number(version.size)) })] }, version.id))) })] })) : null] }), _jsx(UploadDialog, { open: uploadOpen, onOpenChange: setUploadOpen, folders: flatFolders, onUpload: async (payload) => {
                    await documents.uploadMutation.mutateAsync(payload);
                } }), _jsx(ShareDialog, { document: shareDocument, open: Boolean(shareDocument), onOpenChange: (open) => {
                    if (!open) {
                        setShareDocument(null);
                    }
                }, onCreate: (payload) => sharesApi.create(currentTenantId, shareDocument.id, payload) })] }));
}
