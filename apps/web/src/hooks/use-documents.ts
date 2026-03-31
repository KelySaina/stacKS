import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi, foldersApi } from '@/lib/api';

export function useDocuments(tenantId?: string | null, folderId?: string | null) {
  const queryClient = useQueryClient();
  const enabled = Boolean(tenantId);

  const foldersQuery = useQuery({
    queryKey: ['folders', tenantId],
    queryFn: () => foldersApi.list(tenantId!),
    enabled,
  });

  const documentsQuery = useQuery({
    queryKey: ['documents', tenantId, folderId ?? null],
    queryFn: () => documentsApi.list(tenantId!, folderId),
    enabled,
  });

  const refresh = async () => {
    if (!tenantId) {
      return;
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['folders', tenantId] }),
      queryClient.invalidateQueries({ queryKey: ['documents', tenantId] }),
    ]);
  };

  const uploadMutation = useMutation({
    mutationFn: (file: { file: File; folderId?: string; tags?: string[] }) =>
      documentsApi.upload(tenantId!, file),
    onSuccess: refresh,
  });

  const createFolderMutation = useMutation({
    mutationFn: (payload: { name: string; parentId?: string | null }) =>
      foldersApi.create(tenantId!, payload),
    onSuccess: refresh,
  });

  return {
    foldersQuery,
    documentsQuery,
    uploadMutation,
    createFolderMutation,
    refresh,
  };
}