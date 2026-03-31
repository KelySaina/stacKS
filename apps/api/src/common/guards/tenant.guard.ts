import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.params.tenantId;

    if (!tenantId) {
      return true;
    }

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    request.tenant = tenant;

    if (request.user?.isSuperAdmin) {
      request.tenantRole = Role.ADMIN;
      return true;
    }

    const membership = request.user?.tenants?.find(
      (entry: { tenantId: string }) => entry.tenantId === tenantId,
    );

    if (!membership) {
      throw new ForbiddenException('You do not have access to this tenant');
    }

    request.tenantRole = membership.role;
    return true;
  }
}