import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { MinioService } from '../storage/storage.service.js';
import { UploadDocumentDto } from './dto/upload-document.dto.js';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private readonly auditService: AuditService,
  ) {}

  async list(tenantId: string, folderId?: string) {
    return this.prisma.document.findMany({
      where: {
        tenantId,
        folderId: folderId ?? undefined,
        deletedAt: null,
      },
      include: {
        folder: true,
        shares: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(tenantId: string, id: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        folder: true,
        versions: { orderBy: { version: 'desc' } },
        shares: { where: { isActive: true } },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async upload(
    tenantId: string,
    file: Express.Multer.File,
    dto: UploadDocumentDto,
    userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('A file is required');
    }

    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const objectKey = `${tenantId}/${randomUUID()}-${file.originalname}`;

    if (BigInt(tenant.storageUsed) + BigInt(file.size) > BigInt(tenant.storageQuota)) {
      throw new BadRequestException('Tenant storage quota exceeded');
    }

    if (dto.folderId) {
      const folder = await this.prisma.folder.findFirst({ where: { id: dto.folderId, tenantId } });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    await this.minioService.uploadObject(tenant.bucket, objectKey, file.buffer, file.mimetype);

    const document = await this.prisma.document.create({
      data: {
        tenantId,
        folderId: dto.folderId,
        name: file.originalname,
        mimeType: file.mimetype,
        size: BigInt(file.size),
        objectKey,
        uploadedBy: userId,
        tags: dto.tags ?? [],
        metadata: (dto.metadata ?? {}) as Prisma.JsonObject,
        versions: {
          create: {
            version: 1,
            objectKey,
            size: BigInt(file.size),
            uploadedBy: userId,
          },
        },
      },
    });

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { storageUsed: { increment: BigInt(file.size) } },
    });

    await this.auditService.log({
      action: 'UPLOAD',
      resource: 'document',
      resourceId: document.id,
      userId,
      tenantId,
      details: { name: document.name, folderId: dto.folderId ?? null },
    });

    return document;
  }

  async getDownloadUrl(tenantId: string, id: string, userId: string) {
    const document = await this.get(tenantId, id);
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const url = await this.minioService.getDownloadUrl(
      tenant.bucket,
      document.objectKey,
      Number(process.env.PRESIGNED_DOWNLOAD_TTL ?? 3600),
    );

    await this.auditService.log({
      action: 'DOWNLOAD_URL',
      resource: 'document',
      resourceId: document.id,
      userId,
      tenantId,
      details: { name: document.name },
    });

    return { url, expiresIn: Number(process.env.PRESIGNED_DOWNLOAD_TTL ?? 3600) };
  }

  async getUploadUrl(tenantId: string, name: string, mimeType: string) {
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const objectKey = `${tenantId}/${randomUUID()}-${name}`;
    const url = await this.minioService.getUploadUrl(
      tenant.bucket,
      objectKey,
      mimeType,
      Number(process.env.PRESIGNED_UPLOAD_TTL ?? 900),
    );
    return { objectKey, url, expiresIn: Number(process.env.PRESIGNED_UPLOAD_TTL ?? 900) };
  }

  async softDelete(tenantId: string, id: string, userId: string) {
    const document = await this.get(tenantId, id);
    await this.prisma.document.update({
      where: { id: document.id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.log({
      action: 'DELETE',
      resource: 'document',
      resourceId: document.id,
      userId,
      tenantId,
      details: { name: document.name },
    });

    return { success: true };
  }

  async versions(tenantId: string, id: string) {
    const document = await this.get(tenantId, id);
    return this.prisma.documentVersion.findMany({
      where: { documentId: document.id },
      orderBy: { version: 'desc' },
    });
  }

  async uploadNewVersion(
    tenantId: string,
    id: string,
    file: Express.Multer.File,
    userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('A file is required');
    }

    const document = await this.get(tenantId, id);
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const nextVersion = document.version + 1;
    const objectKey = `${tenantId}/${randomUUID()}-${file.originalname}`;

    await this.minioService.uploadObject(tenant.bucket, objectKey, file.buffer, file.mimetype);

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        version: nextVersion,
        objectKey,
        size: BigInt(file.size),
        mimeType: file.mimetype,
        name: file.originalname,
        uploadedBy: userId,
        versions: {
          create: {
            version: nextVersion,
            objectKey,
            size: BigInt(file.size),
            uploadedBy: userId,
          },
        },
      },
    });

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        storageUsed: {
          increment: BigInt(file.size),
        },
      },
    });

    await this.auditService.log({
      action: 'UPLOAD_VERSION',
      resource: 'document',
      resourceId: document.id,
      userId,
      tenantId,
      details: { version: nextVersion },
    });

    return updated;
  }
}