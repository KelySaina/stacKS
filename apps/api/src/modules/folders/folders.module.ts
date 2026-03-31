import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { FoldersController } from './folders.controller.js';
import { FoldersService } from './folders.service.js';

@Module({
  imports: [AuditModule],
  providers: [FoldersService],
  controllers: [FoldersController],
})
export class FoldersModule {}