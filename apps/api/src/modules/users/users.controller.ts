import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { InviteUserDto } from './dto/invite-user.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UsersService } from './users.service.js';

@Controller('tenants/:tenantId/users')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  list(@Param('tenantId') tenantId: string) {
    return this.usersService.list(tenantId);
  }

  @Post()
  @Roles(Role.ADMIN)
  invite(
    @Param('tenantId') tenantId: string,
    @Body() dto: InviteUserDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.usersService.invite(tenantId, dto, user.id);
  }

  @Patch(':userId')
  @Roles(Role.ADMIN)
  updateRole(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.usersService.updateRole(tenantId, userId, dto, user.id);
  }

  @Delete(':userId')
  @Roles(Role.ADMIN)
  remove(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.usersService.remove(tenantId, userId, user.id);
  }
}