import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsOptional()
  @IsString()
  folderId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    return String(value)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  })
  tags?: string[];

  @IsOptional()
  metadata?: Record<string, unknown>;
}