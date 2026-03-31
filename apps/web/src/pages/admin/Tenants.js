import { jsx as _jsx } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/lib/api';
import { TenantManager } from '@/components/admin/tenant-manager';
export function TenantsPage() {
    const queryClient = useQueryClient();
    const tenantsQuery = useQuery({
        queryKey: ['all-tenants'],
        queryFn: tenantsApi.list,
    });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['all-tenants'] });
    const createMutation = useMutation({ mutationFn: tenantsApi.create, onSuccess: refresh });
    const updateMutation = useMutation({
        mutationFn: ({ tenantId, payload }) => tenantsApi.update(tenantId, payload),
        onSuccess: refresh,
    });
    const deleteMutation = useMutation({ mutationFn: tenantsApi.remove, onSuccess: refresh });
    return (_jsx(TenantManager, { tenants: tenantsQuery.data ?? [], onCreate: (payload) => createMutation.mutateAsync(payload).then(() => undefined), onUpdate: (tenantId, payload) => updateMutation.mutateAsync({ tenantId, payload }).then(() => undefined), onDelete: (tenantId) => deleteMutation.mutateAsync(tenantId).then(() => undefined) }));
}
