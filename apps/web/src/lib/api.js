import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const rawClient = axios.create({
    baseURL,
    withCredentials: true,
});
export const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await rawClient.post('/auth/refresh');
            useAuthStore.getState().setSession(response.data);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return apiClient(originalRequest);
        }
        catch {
            useAuthStore.getState().clearSession();
        }
    }
    return Promise.reject(error);
});
export const authApi = {
    login: async (payload) => {
        const response = await apiClient.post('/auth/login', payload);
        return response.data;
    },
    register: async (payload) => {
        const response = await apiClient.post('/auth/register', payload);
        return response.data;
    },
    me: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
    refresh: async () => {
        const response = await rawClient.post('/auth/refresh');
        return response.data;
    },
};
export const tenantsApi = {
    list: async () => (await apiClient.get('/tenants')).data,
    create: async (payload) => (await apiClient.post('/tenants', payload)).data,
    update: async (tenantId, payload) => (await apiClient.patch(`/tenants/${tenantId}`, payload)).data,
    remove: async (tenantId) => (await apiClient.delete(`/tenants/${tenantId}`)).data,
};
export const usersApi = {
    list: async (tenantId) => (await apiClient.get(`/tenants/${tenantId}/users`)).data,
    invite: async (tenantId, payload) => (await apiClient.post(`/tenants/${tenantId}/users`, payload)).data,
    updateRole: async (tenantId, userId, payload) => (await apiClient.patch(`/tenants/${tenantId}/users/${userId}`, payload)).data,
    remove: async (tenantId, userId) => (await apiClient.delete(`/tenants/${tenantId}/users/${userId}`)).data,
};
export const foldersApi = {
    list: async (tenantId) => (await apiClient.get(`/tenants/${tenantId}/folders`)).data,
    create: async (tenantId, payload) => (await apiClient.post(`/tenants/${tenantId}/folders`, payload)).data,
    update: async (tenantId, folderId, payload) => (await apiClient.patch(`/tenants/${tenantId}/folders/${folderId}`, payload)).data,
    remove: async (tenantId, folderId) => (await apiClient.delete(`/tenants/${tenantId}/folders/${folderId}`)).data,
};
export const documentsApi = {
    list: async (tenantId, folderId) => (await apiClient.get(`/tenants/${tenantId}/documents`, {
        params: folderId ? { folderId } : undefined,
    })).data,
    upload: async (tenantId, payload) => {
        const formData = new FormData();
        formData.append('file', payload.file);
        if (payload.folderId) {
            formData.append('folderId', payload.folderId);
        }
        for (const tag of payload.tags ?? []) {
            formData.append('tags', tag);
        }
        return (await apiClient.post(`/tenants/${tenantId}/documents/upload`, formData)).data;
    },
    get: async (tenantId, documentId) => (await apiClient.get(`/tenants/${tenantId}/documents/${documentId}`)).data,
    download: async (tenantId, documentId) => (await apiClient.get(`/tenants/${tenantId}/documents/${documentId}/download`)).data,
    remove: async (tenantId, documentId) => (await apiClient.delete(`/tenants/${tenantId}/documents/${documentId}`)).data,
    versions: async (tenantId, documentId) => (await apiClient.get(`/tenants/${tenantId}/documents/${documentId}/versions`)).data,
    uploadVersion: async (tenantId, documentId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return (await apiClient.post(`/tenants/${tenantId}/documents/${documentId}/upload`, formData)).data;
    },
};
export const sharesApi = {
    create: async (tenantId, documentId, payload) => (await apiClient.post(`/tenants/${tenantId}/documents/${documentId}/share`, payload)).data,
    list: async (tenantId) => (await apiClient.get(`/tenants/${tenantId}/shares`)).data,
    revoke: async (tenantId, shareId) => (await apiClient.delete(`/tenants/${tenantId}/shares/${shareId}`)).data,
    access: async (token, password) => (await rawClient.get(`/shares/${token}`, { params: password ? { password } : undefined })).data,
    download: async (token, payload) => (await rawClient.post(`/shares/${token}/download`, payload)).data,
};
export const auditApi = {
    list: async (tenantId, params) => (await apiClient.get(`/tenants/${tenantId}/audit`, { params })).data,
};
