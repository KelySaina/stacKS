import { jsx as _jsx } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useTenant } from '@/hooks/use-tenant';
import { UserManager } from '@/components/admin/user-manager';
import { Card } from '@/components/ui/card';
export function UsersPage() {
    const { currentTenantId } = useTenant();
    const queryClient = useQueryClient();
    const usersQuery = useQuery({
        queryKey: ['tenant-users', currentTenantId],
        queryFn: () => usersApi.list(currentTenantId),
        enabled: Boolean(currentTenantId),
    });
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['tenant-users', currentTenantId] });
    const inviteMutation = useMutation({
        mutationFn: (payload) => usersApi.invite(currentTenantId, payload),
        onSuccess: refresh,
    });
    const roleMutation = useMutation({
        mutationFn: ({ userId, role }) => usersApi.updateRole(currentTenantId, userId, { role }),
        onSuccess: refresh,
    });
    const removeMutation = useMutation({
        mutationFn: (userId) => usersApi.remove(currentTenantId, userId),
        onSuccess: refresh,
    });
    if (!currentTenantId) {
        return _jsx(Card, { className: "p-6 text-sm text-slate-500", children: "Select a tenant to manage users." });
    }
    return (_jsx(UserManager, { users: usersQuery.data ?? [], onInvite: (payload) => inviteMutation.mutateAsync(payload).then(() => undefined), onUpdateRole: (userId, role) => roleMutation.mutateAsync({ userId, role }).then(() => undefined), onRemove: (userId) => removeMutation.mutateAsync(userId).then(() => undefined) }));
}
