import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
export function UploadDialog({ open, onOpenChange, folders, onUpload, }) {
    const [file, setFile] = useState(null);
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
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, title: "Upload document", description: "Drop a file into the active tenant and route it to a folder if needed.", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center", children: [_jsx(UploadCloud, { className: "mb-4 h-10 w-10 text-ember" }), _jsx("p", { className: "text-base font-semibold text-ink", children: "Choose a file to upload" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "PDF, image, spreadsheet, or any office document." }), _jsx("input", { className: "hidden", type: "file", onChange: (event) => setFile(event.target.files?.[0] ?? null) }), file ? _jsx("p", { className: "mt-4 rounded-full bg-white px-3 py-1 text-sm text-ink", children: file.name }) : null] }), _jsxs("label", { className: "block space-y-2 text-sm font-medium text-ink", children: [_jsx("span", { children: "Folder" }), _jsxs("select", { className: "w-full rounded-2xl border border-[hsl(var(--border))] bg-white px-4 py-3", value: folderId, onChange: (event) => setFolderId(event.target.value), children: [_jsx("option", { value: "", children: "Root" }), folders.map((folder) => (_jsx("option", { value: folder.id, children: folder.path }, folder.id)))] })] }), _jsxs("label", { className: "block space-y-2 text-sm font-medium text-ink", children: [_jsx("span", { children: "Tags" }), _jsx(Input, { value: tags, onChange: (event) => setTags(event.target.value), placeholder: "invoice, signed, hr" })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Cancel" }), _jsx(Button, { onClick: submit, disabled: !file || submitting, children: submitting ? 'Uploading...' : 'Upload' })] })] }) }));
}
