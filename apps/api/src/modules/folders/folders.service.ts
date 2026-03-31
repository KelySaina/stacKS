import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateFolderDto } from './dto/create-folder.dto.js';
import { UpdateFolderDto } from './dto/update-folder.dto.js';

@Injectable()
export class FoldersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async list(tenantId: string) {
    const folders = await this.prisma.folder.findMany({
      where: { tenantId },
      orderBy: { path: 'asc' },
    });

    const byId = new Map(folders.map((folder) => [folder.id, { ...folder, children: [] as unknown[] }]));
    const roots: Array<(typeof folders)[number] & { children: unknown[] }> = [];

    for (const folder of folders) {
      const current = byId.get(folder.id)!;
      if (folder.parentId && byId.has(folder.parentId)) {
        (byId.get(folder.parentId)!.children as unknown[]).push(current);
      } else {
        roots.push(current);
      }
    }

    return { items: folders, tree: roots };
  }

  async create(tenantId: string, dto: CreateFolderDto, userId: string) {
    const parent = dto.parentId
      ? await this.prisma.folder.findFirst({ where: { id: dto.parentId, tenantId } })
      : null;

    if (dto.parentId && !parent) {
      throw new NotFoundException('Parent folder not found');
    }

    const path = `${parent?.path ?? ''}/${dto.name}`.replace(/\/+/g, '/');
    const existing = await this.prisma.folder.findUnique({
      where: {
        tenantId_path: { tenantId, path },
      },
    });

    if (existing) {
      throw new BadRequestException('A folder already exists at this path');
    }

    const folder = await this.prisma.folder.create({
      data: {
        tenantId,
        name: dto.name,
        parentId: parent?.id,
        path,
      },
    });

    await this.auditService.log({
      action: 'FOLDER_CREATE',
      resource: 'folder',
      resourceId: folder.id,
      tenantId,
      userId,
      details: { path: folder.path },
    });

    return folder;
  }

  async update(tenantId: string, id: string, dto: UpdateFolderDto, userId: string) {
    const folder = await this.prisma.folder.findFirst({ where: { id, tenantId } });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const parent = dto.parentId
      ? await this.prisma.folder.findFirst({ where: { id: dto.parentId, tenantId } })
      : dto.parentId === null
        ? null
        : folder.parentId
          ? await this.prisma.folder.findFirst({ where: { id: folder.parentId, tenantId } })
          : null;

    const nextName = dto.name ?? folder.name;
    const nextPath = `${parent?.path ?? ''}/${nextName}`.replace(/\/+/g, '/');

    const descendants = await this.prisma.folder.findMany({
      where: { tenantId, path: { startsWith: `${folder.path}/` } },
    });

    const updated = await this.prisma.folder.update({
      where: { id },
      data: {
        name: nextName,
        parentId: dto.parentId === undefined ? folder.parentId : dto.parentId,
        path: nextPath,
      },
    });

    await Promise.all(
      descendants.map((entry) =>
        this.prisma.folder.update({
          where: { id: entry.id },
          data: { path: entry.path.replace(folder.path, nextPath) },
        }),
      ),
    );

    await this.auditService.log({
      action: 'FOLDER_UPDATE',
      resource: 'folder',
      resourceId: folder.id,
      tenantId,
      userId,
      details: { from: folder.path, to: nextPath },
    });

    return updated;
  }

  async remove(tenantId: string, id: string, userId: string) {
    const folder = await this.prisma.folder.findFirst({ where: { id, tenantId } });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    await this.auditService.log({
      action: 'FOLDER_DELETE',
      resource: 'folder',
      resourceId: folder.id,
      tenantId,
      userId,
      details: { path: folder.path },
    });

    await this.prisma.folder.delete({ where: { id } });
    return { success: true };
  }
}