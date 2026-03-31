import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { DocumentsController } from './documents.controller.js';
import { DocumentsService } from './documents.service.js';

@Module({
  imports: [AuditModule],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}