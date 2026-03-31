import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type {
  AuditLog,
  AuthPayload,
  Document,
  DocumentVersion,
  Folder,
  FoldersResponse,
  PublicShareAccess,
  Share,
  Tenant,
  TenantUsersItem,
} from '@/lib/types';

const fallbackApiUrl = `${window.location.protocol}//${window.location.hostname}:3001/api`;
const baseURL = import.meta.env.VITE_API_URL ?? fallbackApiUrl;

const rawClient = axios.create({
  baseURL,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await rawClient.post<AuthPayload>('/auth/refresh');
        useAuthStore.getState().setSession(response.data);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().clearSession();
      }
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const response = await apiClient.post<AuthPayload>('/auth/login', payload);
    return response.data;
  },
  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantId?: string;
  }) => {
    const response = await apiClient.post<AuthPayload>('/auth/register', payload);
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get<AuthPayload>('/auth/me');
    return response.data;
  },
  refresh: async () => {
    const response = await rawClient.post<AuthPayload>('/auth/refresh');
    return response.data;
  },
};

export const tenantsApi = {
  list: async () => (await apiClient.get<Tenant[]>('/tenants')).data,
  create: async (payload: { name: string; slug?: string; storageQuota?: number }) =>
    (await apiClient.post<Tenant>('/tenants', payload)).data,
  update: async (tenantId: string, payload: { name?: string; storageQuota?: number }) =>
    (await apiClient.patch<Tenant>(`/tenants/${tenantId}`, payload)).data,
  remove: async (tenantId: string) => (await apiClient.delete(`/tenants/${tenantId}`)).data,
};

export const usersApi = {
  list: async (tenantId: string) =>
    (await apiClient.get<TenantUsersItem[]>(`/tenants/${tenantId}/users`)).data,
  invite: async (
    tenantId: string,
    payload: { email: string; firstName: string; lastName: string; role: 'ADMIN' | 'EDITOR' | 'VIEWER' },
  ) => (await apiClient.post<TenantUsersItem>(`/tenants/${tenantId}/users`, payload)).data,
  updateRole: async (tenantId: string, userId: string, payload: { role: 'ADMIN' | 'EDITOR' | 'VIEWER' }) =>
    (await apiClient.patch<TenantUsersItem>(`/tenants/${tenantId}/users/${userId}`, payload)).data,
  remove: async (tenantId: string, userId: string) =>
    (await apiClient.delete(`/tenants/${tenantId}/users/${userId}`)).data,
};

export const foldersApi = {
  list: async (tenantId: string) =>
    (await apiClient.get<FoldersResponse>(`/tenants/${tenantId}/folders`)).data,
  create: async (tenantId: string, payload: { name: string; parentId?: string | null }) =>
    (await apiClient.post<Folder>(`/tenants/${tenantId}/folders`, payload)).data,
  update: async (tenantId: string, folderId: string, payload: { name?: string; parentId?: string | null }) =>
    (await apiClient.patch<Folder>(`/tenants/${tenantId}/folders/${folderId}`, payload)).data,
  remove: async (tenantId: string, folderId: string) =>
    (await apiClient.delete(`/tenants/${tenantId}/folders/${folderId}`)).data,
};

export const documentsApi = {
  list: async (tenantId: string, folderId?: string | null) =>
    (
      await apiClient.get<Document[]>(`/tenants/${tenantId}/documents`, {
        params: folderId ? { folderId } : undefined,
      })
    ).data,
  upload: async (tenantId: string, payload: { file: File; folderId?: string; tags?: string[] }) => {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.folderId) {
      formData.append('folderId', payload.folderId);
    }
    for (const tag of payload.tags ?? []) {
      formData.append('tags', tag);
    }
    return (await apiClient.post<Document>(`/tenants/${tenantId}/documents/upload`, formData)).data;
  },
  get: async (tenantId: string, documentId: string) =>
    (await apiClient.get<Document>(`/tenants/${tenantId}/documents/${documentId}`)).data,
  download: async (tenantId: string, documentId: string) =>
    (await apiClient.get<{ url: string; expiresIn: number }>(`/tenants/${tenantId}/documents/${documentId}/download`)).data,
  remove: async (tenantId: string, documentId: string) =>
    (await apiClient.delete(`/tenants/${tenantId}/documents/${documentId}`)).data,
  versions: async (tenantId: string, documentId: string) =>
    (await apiClient.get<DocumentVersion[]>(`/tenants/${tenantId}/documents/${documentId}/versions`)).data,
  uploadVersion: async (tenantId: string, documentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return (
      await apiClient.post<Document>(`/tenants/${tenantId}/documents/${documentId}/upload`, formData)
    ).data;
  },
};

export const sharesApi = {
  create: async (
    tenantId: string,
    documentId: string,
    payload: { expiresAt: string; password?: string; maxDownloads?: number },
  ) => (await apiClient.post<Share>(`/tenants/${tenantId}/documents/${documentId}/share`, payload)).data,
  list: async (tenantId: string) =>
    (await apiClient.get<Share[]>(`/tenants/${tenantId}/shares`)).data,
  revoke: async (tenantId: string, shareId: string) =>
    (await apiClient.delete(`/tenants/${tenantId}/shares/${shareId}`)).data,
  access: async (token: string, password?: string) =>
    (await rawClient.get<PublicShareAccess>(`/shares/${token}`, { params: password ? { password } : undefined })).data,
  download: async (token: string, payload: { password?: string }) =>
    (await rawClient.post<{ url: string; expiresIn: number }>(`/shares/${token}/download`, payload)).data,
};

export const auditApi = {
  list: async (tenantId: string, params?: { action?: string; userId?: string; from?: string; to?: string }) =>
    (await apiClient.get<AuditLog[]>(`/tenants/${tenantId}/audit`, { params })).data,
};