import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { TenantGuard } from './guards/tenant.guard.js';
import { SuperAdminGuard } from './guards/super-admin.guard.js';

@Global()
@Module({
  providers: [AuthGuard, RolesGuard, TenantGuard, SuperAdminGuard],
  exports: [AuthGuard, RolesGuard, TenantGuard, SuperAdminGuard],
})
export class SecurityModule {}