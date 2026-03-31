import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugifyModule from 'slugify';
import { PrismaService } from '../../prisma/prisma.service.js';
import { MinioService } from '../storage/storage.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';

const slugify =
  typeof slugifyModule === 'function' ? slugifyModule : slugifyModule.default;

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateTenantDto, userId: string) {
    const slug = slugify(dto.slug ?? dto.name, { lower: true, strict: true });
    const bucket = `tenant-${slug}`;

    const existing = await this.prisma.tenant.findFirst({
      where: {
        OR: [{ slug }, { bucket }],
      },
    });

    if (existing) {
      throw new BadRequestException('Tenant slug already exists');
    }

    await this.minioService.ensureBucket(bucket);
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug,
        bucket,
        storageQuota: dto.storageQuota ? BigInt(dto.storageQuota) : undefined,
      },
    });

    await this.auditService.log({
      action: 'TENANT_CREATE',
      resource: 'tenant',
      resourceId: tenant.id,
      tenantId: tenant.id,
      userId,
      details: { name: tenant.name, slug: tenant.slug },
    });

    return tenant;
  }

  list() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id },
      data: {
        name: dto.name,
        storageQuota: dto.storageQuota ? BigInt(dto.storageQuota) : undefined,
      },
    });
  }

  async remove(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.minioService.deleteBucket(tenant.bucket);
    return this.prisma.tenant.delete({ where: { id } });
  }
}