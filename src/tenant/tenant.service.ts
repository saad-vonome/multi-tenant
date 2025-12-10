import { ConflictException, Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { CorePrismaService } from 'prisma/migrations/core/core-prisma.service';

@Injectable()
export class TenantService {
  constructor(private readonly corePrisma: CorePrismaService) {}

  async createTenant(name: string, domain?: string) {
    // Generate schema name
    const schemaName = `tenant_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Check if tenant already exists
    const existingTenant = await this.corePrisma.tenant.findFirst({
      where: {
        OR: [{ name }, { schemaName }, { domain }],
      },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant already exists');
    }

    // Create tenant record
    const tenant = await this.corePrisma.tenant.create({
      data: {
        name,
        schemaName,
        domain,
        isActive: true,
      },
    });

    // Create schema and run migrations
    await this.provisionTenantSchema(schemaName);

    return tenant;
  }

  private async provisionTenantSchema(schemaName: string) {
    try {
      // Create schema
      await this.corePrisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
      );

      // Run migrations for tenant schema
      const databaseUrl = process.env.DATABASE_URL?.split('?')[0];
      const migrationUrl = `${databaseUrl}?schema=${schemaName}`;

      execSync(
        `npx prisma migrate deploy --schema=./prisma/tenant-schema.prisma`,
        {
          env: { ...process.env, DATABASE_URL: migrationUrl },
          stdio: 'inherit',
        },
      );

      console.log(`Schema ${schemaName} provisioned successfully`);
    } catch (error) {
      console.error(`Failed to provision schema ${schemaName}:`, error);
      throw error;
    }
  }

  async listTenants() {
    return this.corePrisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTenant(id: string) {
    return this.corePrisma.tenant.findUnique({
      where: { id },
      include: { configurations: true },
    });
  }
}
