import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryAuditDto } from './dto/query-audit.dto.js';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: {
    action: string;
    resource: string;
    resourceId?: string;
    details?: Prisma.JsonValue;
    userId: string;
    tenantId: string;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...input,
        details:
          input.details === undefined
            ? undefined
            : (input.details as Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput),
      },
    });
  }

  async list(tenantId: string, query: QueryAuditDto) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        action: query.action,
        userId: query.userId,
        createdAt: query.from || query.to
          ? {
              gte: query.from ? new Date(query.from) : undefined,
              lte: query.to ? new Date(query.to) : undefined,
            }
          : undefined,
      },
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
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}