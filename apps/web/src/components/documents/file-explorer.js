import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderOpen, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
function TreeNode({ folder, activeFolderId, onSelect }) {
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("button", { className: `flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${activeFolderId === folder.id ? 'bg-sky text-ink' : 'hover:bg-slate-100'}`, onClick: () => onSelect(folder.id), children: [_jsx(FolderOpen, { className: "h-4 w-4" }), _jsx("span", { className: "truncate", children: folder.name })] }), folder.children?.length ? (_jsx("div", { className: "ml-3 border-l border-slate-200 pl-3", children: folder.children.map((child) => (_jsx(TreeNode, { folder: child, activeFolderId: activeFolderId, onSelect: onSelect }, child.id))) })) : null] }));
}
export function FileExplorer({ folders, activeFolderId, onSelect, onCreateFolder, }) {
    return (_jsxs(Card, { className: "h-full p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Folders" }), _jsx("h2", { className: "font-display text-xl font-bold text-ink", children: "Explorer" })] }), _jsxs(Button, { variant: "ghost", onClick: onCreateFolder, children: [_jsx(FolderPlus, { className: "mr-2 h-4 w-4" }), "New"] })] }), _jsx("button", { className: "mb-3 w-full rounded-2xl bg-moss/10 px-3 py-2 text-left text-sm font-semibold text-moss", onClick: () => onSelect(null), children: "All documents" }), _jsx("div", { className: "space-y-2", children: folders.length ? folders.map((folder) => (_jsx(TreeNode, { folder: folder, activeFolderId: activeFolderId, onSelect: onSelect }, folder.id))) : _jsx("p", { className: "text-sm text-slate-500", children: "No folders yet." }) })] }));
}
