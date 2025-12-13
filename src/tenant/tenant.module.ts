import { Module } from '@nestjs/common';
import { TenantConnectionService } from './tenant-connection.service';
import { TenantContextService } from './tenant-context.service';

@Module({
  providers: [TenantConnectionService, TenantContextService],
  exports: [TenantConnectionService],
})
export class TenantModule {}
