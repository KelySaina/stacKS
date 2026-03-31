import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { CreateFolderDto } from './dto/create-folder.dto.js';
import { UpdateFolderDto } from './dto/update-folder.dto.js';
import { FoldersService } from './folders.service.js';

@Controller('tenants/:tenantId/folders')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  list(@Param('tenantId') tenantId: string) {
    return this.foldersService.list(tenantId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateFolderDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.foldersService.create(tenantId, dto, user.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.foldersService.update(tenantId, id, dto, user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  remove(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.foldersService.remove(tenantId, id, user.id);
  }
}