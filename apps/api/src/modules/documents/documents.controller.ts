import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { UploadDocumentDto } from './dto/upload-document.dto.js';
import { DocumentsService } from './documents.service.js';

@Controller('tenants/:tenantId/documents')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  list(@Param('tenantId') tenantId: string, @Query('folderId') folderId?: string) {
    return this.documentsService.list(tenantId, folderId);
  }

  @Get('upload/presigned/url')
  @Roles(Role.ADMIN, Role.EDITOR)
  presignUpload(
    @Param('tenantId') tenantId: string,
    @Query('name') name: string,
    @Query('mimeType') mimeType: string,
  ) {
    return this.documentsService.getUploadUrl(tenantId, name, mimeType);
  }

  @Post('upload')
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(
    @Param('tenantId') tenantId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.documentsService.upload(tenantId, file, dto, user.id);
  }

  @Get(':id')
  get(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.documentsService.get(tenantId, id);
  }

  @Get(':id/download')
  getDownloadUrl(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.documentsService.getDownloadUrl(tenantId, id, user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  remove(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.documentsService.softDelete(tenantId, id, user.id);
  }

  @Get(':id/versions')
  versions(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.documentsService.versions(tenantId, id);
  }

  @Post(':id/upload')
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadNewVersion(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ) {
    return this.documentsService.uploadNewVersion(tenantId, id, file, user.id);
  }
}