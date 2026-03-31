import { create } from 'zustand';

interface TenantState {
  currentTenantId: string | null;
  setCurrentTenantId: (tenantId: string | null) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentTenantId: null,
  setCurrentTenantId: (tenantId) => set({ currentTenantId: tenantId }),
}));