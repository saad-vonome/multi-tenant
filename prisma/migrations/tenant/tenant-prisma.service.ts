import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { PrismaClient } from 'generated/tenant-client';
import { TenantContextService } from 'src/tenant/tenant-context.service';

@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService implements OnModuleInit {
  private prismaClient: PrismaClient;

  constructor(
    @Inject(TenantContextService)
    private readonly tenantContext: TenantContextService,
  ) {
    const schemaName = tenantContext.getSchemaName();
    const baseUrl = process.env.DATABASE_URL?.split('?')[0] || '';

    // Create client with schema-specific URL
    this.prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: `${baseUrl}?schema=${schemaName}&connection_limit=50`,
        },
      },
    } as any); // Type assertion if TypeScript complains
  }

  async onModuleInit() {
    await this.prismaClient.$connect();

    // Set search_path as additional safety measure
    const schemaName = this.tenantContext.getSchemaName();
    await this.prismaClient.$executeRawUnsafe(
      `SET search_path TO "${schemaName}"`,
    );
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }
}
