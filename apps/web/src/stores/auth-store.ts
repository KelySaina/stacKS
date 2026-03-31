import { create } from 'zustand';
import type { AuthPayload, TenantMembership, User } from '@/lib/types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  tenants: TenantMembership[];
  initialized: boolean;
  setSession: (payload: AuthPayload) => void;
  markInitialized: () => void;
  clearSession: () => void;
  updateTenants: (tenants: TenantMembership[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  tenants: [],
  initialized: false,
  setSession: (payload) =>
    set({
      accessToken: payload.accessToken,
      user: payload.user,
      tenants: payload.tenants,
      initialized: true,
    }),
  markInitialized: () => set({ initialized: true }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      tenants: [],
      initialized: true,
    }),
  updateTenants: (tenants) => set({ tenants }),
}));