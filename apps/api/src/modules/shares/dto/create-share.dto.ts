import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateShareDto {
  @IsDateString()
  expiresAt!: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxDownloads?: number;
}