import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { SharesController } from './shares.controller.js';
import { SharesService } from './shares.service.js';

@Module({
  imports: [AuditModule],
  providers: [SharesService],
  controllers: [SharesController],
})
export class SharesModule {}