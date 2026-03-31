import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    accessToken: null,
    user: null,
    tenants: [],
    initialized: false,
    setSession: (payload) => set({
        accessToken: payload.accessToken,
        user: payload.user,
        tenants: payload.tenants,
        initialized: true,
    }),
    markInitialized: () => set({ initialized: true }),
    clearSession: () => set({
        accessToken: null,
        user: null,
        tenants: [],
        initialized: true,
    }),
    updateTenants: (tenants) => set({ tenants }),
}));
