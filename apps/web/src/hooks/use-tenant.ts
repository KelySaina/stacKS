import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';

export function useTenant() {
  const tenants = useAuthStore((state) => state.tenants);
  const currentTenantId = useTenantStore((state) => state.currentTenantId);
  const setCurrentTenantId = useTenantStore((state) => state.setCurrentTenantId);

  const currentMembership = useMemo(
    () => tenants.find((membership) => membership.tenant.id === currentTenantId) ?? tenants[0] ?? null,
    [currentTenantId, tenants],
  );

  return {
    tenants,
    currentTenant: currentMembership?.tenant ?? null,
    currentRole: currentMembership?.role ?? null,
    currentTenantId: currentMembership?.tenant.id ?? null,
    setCurrentTenantId,
  };
}