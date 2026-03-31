import { IsOptional, IsString } from 'class-validator';

export class AccessShareDto {
  @IsOptional()
  @IsString()
  password?: string;
}