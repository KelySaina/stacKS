import { FolderOpen, FolderPlus } from 'lucide-react';
import type { Folder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function TreeNode({ folder, activeFolderId, onSelect }: {
  folder: Folder;
  activeFolderId?: string | null;
  onSelect: (folderId: string | null) => void;
}) {
  return (
    <div className="space-y-2">
      <button
        className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
          activeFolderId === folder.id ? 'bg-sky text-ink' : 'hover:bg-slate-100'
        }`}
        onClick={() => onSelect(folder.id)}
      >
        <FolderOpen className="h-4 w-4" />
        <span className="truncate">{folder.name}</span>
      </button>
      {folder.children?.length ? (
        <div className="ml-3 border-l border-slate-200 pl-3">
          {folder.children.map((child) => (
            <TreeNode key={child.id} folder={child} activeFolderId={activeFolderId} onSelect={onSelect} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function FileExplorer({
  folders,
  activeFolderId,
  onSelect,
  onCreateFolder,
}: {
  folders: Folder[];
  activeFolderId?: string | null;
  onSelect: (folderId: string | null) => void;
  onCreateFolder: () => void;
}) {
  return (
    <Card className="h-full p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Folders</p>
          <h2 className="font-display text-xl font-bold text-ink">Explorer</h2>
        </div>
        <Button variant="ghost" onClick={onCreateFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>
      <button className="mb-3 w-full rounded-2xl bg-moss/10 px-3 py-2 text-left text-sm font-semibold text-moss" onClick={() => onSelect(null)}>
        All documents
      </button>
      <div className="space-y-2">
        {folders.length ? folders.map((folder) => (
          <TreeNode key={folder.id} folder={folder} activeFolderId={activeFolderId} onSelect={onSelect} />
        )) : <p className="text-sm text-slate-500">No folders yet.</p>}
      </div>
    </Card>
  );
}