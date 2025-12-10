import { Global, Module } from '@nestjs/common';
import { CorePrismaService } from './migrations/core/core-prisma.service';
import { TenantPrismaService } from './migrations/tenant/tenant-prisma.service';

@Global()
@Module({
  providers: [CorePrismaService, TenantPrismaService],
  exports: [CorePrismaService, TenantPrismaService],
})
export class PrismaModule {}
