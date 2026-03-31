import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { UsersModule } from './users/users.module.js';
import { FoldersModule } from './folders/folders.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { SharesModule } from './shares/shares.module.js';
import { AuditModule } from './audit/audit.module.js';
import { StorageModule } from './storage/storage.module.js';
import { SecurityModule } from '../common/security.module.js';
import { BigIntInterceptor } from '../common/interceptors/bigint.interceptor.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StorageModule,
    SecurityModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    FoldersModule,
    DocumentsModule,
    SharesModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: BigIntInterceptor,
    },
  ],
})
export class AppModule {}