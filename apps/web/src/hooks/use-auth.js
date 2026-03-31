import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
export function useAuth() {
    const state = useAuthStore();
    const setCurrentTenantId = useTenantStore((store) => store.setCurrentTenantId);
    const currentTenantId = useTenantStore((store) => store.currentTenantId);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        if (state.initialized) {
            return;
        }
        let active = true;
        authApi
            .refresh()
            .then((payload) => {
            if (!active) {
                return;
            }
            state.setSession(payload);
            if (!currentTenantId) {
                setCurrentTenantId(payload.tenants[0]?.tenant.id ?? null);
            }
        })
            .catch(() => {
            if (active) {
                state.markInitialized();
            }
        });
        return () => {
            active = false;
        };
    }, [currentTenantId, setCurrentTenantId, state]);
    const syncTenant = (tenantId) => {
        const next = tenantId ?? useAuthStore.getState().tenants[0]?.tenant.id ?? null;
        setCurrentTenantId(next);
    };
    return {
        ...state,
        busy,
        login: async (email, password) => {
            setBusy(true);
            try {
                const payload = await authApi.login({ email, password });
                state.setSession(payload);
                syncTenant(payload.tenants[0]?.tenant.id);
                return payload;
            }
            finally {
                setBusy(false);
            }
        },
        register: async (payload) => {
            setBusy(true);
            try {
                const authPayload = await authApi.register(payload);
                state.setSession(authPayload);
                syncTenant(authPayload.tenants[0]?.tenant.id);
                return authPayload;
            }
            finally {
                setBusy(false);
            }
        },
        logout: () => {
            state.clearSession();
            setCurrentTenantId(null);
        },
    };
}
