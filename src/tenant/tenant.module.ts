import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TenantPrismaService } from 'prisma/migrations/tenant/tenant-prisma.service';
import { TenantContextService } from './tenant-context.service';
import { TenantController } from './tenant.controller';
import { TenantMiddleware } from './tenant.middleware';
import { TenantService } from './tenant.service';

@Module({
  providers: [TenantContextService, TenantPrismaService],
  controllers: [TenantController],
  exports: [TenantContextService, TenantService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude('/health', '/tenants/register')
      .forRoutes('*');
  }
}
