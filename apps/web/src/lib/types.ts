export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  bucket: string;
  storageQuota: number | string;
  storageUsed: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
}

export interface TenantMembership {
  id: string;
  role: Role;
  tenantId: string;
  userId: string;
  tenant: Tenant;
}

export interface AuthPayload {
  user: User;
  tenants: TenantMembership[];
  accessToken: string;
  refreshToken: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId?: string | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
}

export interface Share {
  id: string;
  token: string;
  documentId: string;
  tenantId: string;
  createdBy: string;
  expiresAt: string;
  password?: string | null;
  maxDownloads?: number | null;
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  document?: Document;
}

export interface DocumentVersion {
  id: string;
  version: number;
  objectKey: string;
  size: number | string;
  uploadedBy: string;
  documentId: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  mimeType: string;
  size: number | string;
  objectKey: string;
  version: number;
  tags: string[];
  metadata?: Record<string, unknown> | null;
  folderId?: string | null;
  tenantId: string;
  uploadedBy: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  folder?: Folder | null;
  versions?: DocumentVersion[];
  shares?: Share[];
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | null;
  userId: string;
  tenantId: string;
  ipAddress?: string | null;
  createdAt: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}

export interface PublicShareAccess {
  share: {
    id: string;
    expiresAt: string;
    maxDownloads?: number | null;
    downloadCount: number;
  };
  document: {
    id: string;
    name: string;
    mimeType: string;
    size: number | string;
  };
}

export interface TenantUsersItem {
  id: string;
  role: Role;
  tenantId: string;
  userId: string;
  user: User;
}

export interface FoldersResponse {
  items: Folder[];
  tree: Folder[];
}