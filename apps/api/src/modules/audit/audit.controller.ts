import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { AuditService } from './audit.service.js';
import { QueryAuditDto } from './dto/query-audit.dto.js';

@Controller('tenants/:tenantId/audit')
@UseGuards(AuthGuard, TenantGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(@Param('tenantId') tenantId: string, @Query() query: QueryAuditDto) {
    return this.auditService.list(tenantId, query);
  }
}