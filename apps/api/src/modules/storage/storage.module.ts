import { Global, Module } from '@nestjs/common';
import { MinioService } from './storage.service.js';

@Global()
@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class StorageModule {}