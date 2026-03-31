import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { InviteUserDto } from './dto/invite-user.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async list(tenantId: string) {
    return this.prisma.tenantUser.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isSuperAdmin: true,
          },
        },
      },
      orderBy: { user: { firstName: 'asc' } },
    });
  }

  async invite(tenantId: string, dto: InviteUserDto, currentUserId: string) {
    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      const passwordHash = await bcrypt.hash(dto.password ?? 'welcome123', 10);
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
    }

    const existingMembership = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      throw new BadRequestException('User already belongs to this tenant');
    }

    const membership = await this.prisma.tenantUser.create({
      data: {
        tenantId,
        userId: user.id,
        role: dto.role,
      },
      include: {
        user: true,
      },
    });

    await this.auditService.log({
      action: 'USER_INVITE',
      resource: 'tenant-user',
      resourceId: membership.id,
      userId: currentUserId,
      tenantId,
      details: { invitedUserId: user.id, role: dto.role },
    });

    return membership;
  }

  async updateRole(tenantId: string, userId: string, dto: UpdateUserRoleDto, currentUserId: string) {
    const membership = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Tenant user not found');
    }

    const updated = await this.prisma.tenantUser.update({
      where: { id: membership.id },
      data: { role: dto.role },
    });

    await this.auditService.log({
      action: 'USER_ROLE_UPDATE',
      resource: 'tenant-user',
      resourceId: membership.id,
      userId: currentUserId,
      tenantId,
      details: { targetUserId: userId, role: dto.role },
    });

    return updated;
  }

  async remove(tenantId: string, userId: string, currentUserId: string) {
    const membership = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Tenant user not found');
    }

    await this.auditService.log({
      action: 'USER_REMOVE',
      resource: 'tenant-user',
      resourceId: membership.id,
      userId: currentUserId,
      tenantId,
      details: { targetUserId: userId },
    });

    await this.prisma.tenantUser.delete({ where: { id: membership.id } });
    return { success: true };
  }
}