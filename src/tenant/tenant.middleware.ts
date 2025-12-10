import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CorePrismaService } from 'prisma/migrations/core/core-prisma.service';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly corePrisma: CorePrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantIdentifier =
      (req.headers['x-tenant-id'] as string) ||
      this.extractSubdomain(req.hostname) ||
      (req.query.tenant as string);

    if (!tenantIdentifier) {
      throw new BadRequestException('Tenant identifier is required');
    }

    // Lookup tenant in core schema
    const tenant = await this.corePrisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantIdentifier },
          { name: tenantIdentifier },
          { domain: tenantIdentifier },
        ],
        isActive: true,
      },
    });

    if (!tenant) {
      throw new BadRequestException('Invalid or inactive tenant');
    }

    // Set tenant context
    this.tenantContext.setTenant(tenant.id, tenant.schemaName);

    next();
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  }
}
