import { create } from 'zustand';
export const useTenantStore = create((set) => ({
    currentTenantId: null,
    setCurrentTenantId: (tenantId) => set({ currentTenantId: tenantId }),
}));
