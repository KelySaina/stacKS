import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumberString()
  storageQuota?: string;
}