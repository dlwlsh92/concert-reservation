import { Module } from '@nestjs/common';
import { DataplatformService } from './dataplatform.service';

@Module({
  providers: [DataplatformService],
  exports: [DataplatformService],
})
export class DataplatformModule {}
