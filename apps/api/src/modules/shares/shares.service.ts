import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { MinioService } from '../storage/storage.service.js';
import { CreateShareDto } from './dto/create-share.dto.js';
import { AccessShareDto } from './dto/access-share.dto.js';

@Injectable()
export class SharesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private readonly auditService: AuditService,
  ) {}

  async create(tenantId: string, documentId: string, dto: CreateShareDto, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId, deletedAt: null },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const password = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
    const share = await this.prisma.share.create({
      data: {
        tenantId,
        documentId,
        createdBy: userId,
        expiresAt: new Date(dto.expiresAt),
        password,
        maxDownloads: dto.maxDownloads,
      },
      include: {
        document: true,
      },
    });

    await this.auditService.log({
      action: 'SHARE_CREATE',
      resource: 'share',
      resourceId: share.id,
      userId,
      tenantId,
      details: { documentId, expiresAt: share.expiresAt.toISOString() },
    });

    return share;
  }

  async list(tenantId: string) {
    return this.prisma.share.findMany({
      where: { tenantId, isActive: true },
      include: { document: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(tenantId: string, id: string, userId: string) {
    const share = await this.prisma.share.findFirst({ where: { id, tenantId } });
    if (!share) {
      throw new NotFoundException('Share not found');
    }

    const revoked = await this.prisma.share.update({
      where: { id },
      data: { isActive: false },
    });

    await this.auditService.log({
      action: 'SHARE_REVOKE',
      resource: 'share',
      resourceId: revoked.id,
      userId,
      tenantId,
      details: { documentId: revoked.documentId },
    });

    return revoked;
  }

  async access(token: string, dto?: AccessShareDto) {
    const share = await this.prisma.share.findUnique({
      where: { token },
      include: {
        document: true,
        tenant: true,
      },
    });

    await this.validateShare(share, dto?.password);
    const validShare = share!;

    return {
      share: {
        id: validShare.id,
        expiresAt: validShare.expiresAt,
        maxDownloads: validShare.maxDownloads,
        downloadCount: validShare.downloadCount,
      },
      document: {
        id: validShare.document.id,
        name: validShare.document.name,
        mimeType: validShare.document.mimeType,
        size: validShare.document.size,
      },
    };
  }

  async download(token: string, dto?: AccessShareDto) {
    const share = await this.prisma.share.findUnique({
      where: { token },
      include: {
        document: true,
        tenant: true,
      },
    });

    await this.validateShare(share, dto?.password);
    const validShare = share!;

    const url = await this.minioService.getDownloadUrl(
      validShare.tenant.bucket,
      validShare.document.objectKey,
      Number(process.env.PRESIGNED_DOWNLOAD_TTL ?? 3600),
    );

    await this.prisma.share.update({
      where: { id: validShare.id },
      data: { downloadCount: { increment: 1 } },
    });

    await this.auditService.log({
      action: 'SHARE_DOWNLOAD',
      resource: 'share',
      resourceId: validShare.id,
      userId: validShare.createdBy,
      tenantId: validShare.tenantId,
      details: { documentId: validShare.documentId },
    });

    return { url, expiresIn: Number(process.env.PRESIGNED_DOWNLOAD_TTL ?? 3600) };
  }

  private async validateShare(
    share:
      | {
          id: string;
          isActive: boolean;
          expiresAt: Date;
          password: string | null;
          maxDownloads: number | null;
          downloadCount: number;
        }
      | null,
    password?: string,
  ) {
    if (!share || !share.isActive) {
      throw new NotFoundException('Share not found');
    }

    if (share.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Share has expired');
    }

    if (share.maxDownloads && share.downloadCount >= share.maxDownloads) {
      throw new BadRequestException('Share download limit reached');
    }

    if (share.password && !password) {
      throw new ForbiddenException('Password required');
    }

    if (share.password && !(await bcrypt.compare(password!, share.password))) {
      throw new ForbiddenException('Invalid password');
    }
  }
}