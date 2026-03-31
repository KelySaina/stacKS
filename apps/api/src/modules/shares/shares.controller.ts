import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { AccessShareDto } from './dto/access-share.dto.js';
import { CreateShareDto } from './dto/create-share.dto.js';
import { SharesService } from './shares.service.js';

@Controller()
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Post('tenants/:tenantId/documents/:id/share')
  @UseGuards(AuthGuard, TenantGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  create(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateShareDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.sharesService.create(tenantId, id, dto, user.id);
  }

  @Get('tenants/:tenantId/shares')
  @UseGuards(AuthGuard, TenantGuard)
  list(@Param('tenantId') tenantId: string) {
    return this.sharesService.list(tenantId);
  }

  @Delete('tenants/:tenantId/shares/:id')
  @UseGuards(AuthGuard, TenantGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  revoke(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.sharesService.revoke(tenantId, id, user.id);
  }

  @Public()
  @Get('shares/:token')
  access(@Param('token') token: string, @Query('password') password?: string) {
    return this.sharesService.access(token, { password });
  }

  @Public()
  @Post('shares/:token/download')
  download(@Param('token') token: string, @Body() dto: AccessShareDto) {
    return this.sharesService.download(token, dto);
  }
}