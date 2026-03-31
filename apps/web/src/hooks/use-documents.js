import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi, foldersApi } from '@/lib/api';
export function useDocuments(tenantId, folderId) {
    const queryClient = useQueryClient();
    const enabled = Boolean(tenantId);
    const foldersQuery = useQuery({
        queryKey: ['folders', tenantId],
        queryFn: () => foldersApi.list(tenantId),
        enabled,
    });
    const documentsQuery = useQuery({
        queryKey: ['documents', tenantId, folderId ?? null],
        queryFn: () => documentsApi.list(tenantId, folderId),
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
        mutationFn: (file) => documentsApi.upload(tenantId, file),
        onSuccess: refresh,
    });
    const createFolderMutation = useMutation({
        mutationFn: (payload) => foldersApi.create(tenantId, payload),
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
