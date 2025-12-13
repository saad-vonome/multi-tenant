//tenant.middleware.ts

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CoreService } from 'src/core/core.service';
import { TenantContextService } from 'src/tenant/tenant-context.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly coreService: CoreService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant identifier from header
    const tenantIdentifier = this.extractTenantIdentifier(req);
    if (!tenantIdentifier) {
      throw new UnauthorizedException('Tenant identifier not provided');
    }
    // Fetch tenant from public schema
    const tenant = await this.coreService.getTenantBySchema(tenantIdentifier);

    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    if (!tenant.isActive) {
      throw new UnauthorizedException('Tenant is not active');
    }
    // Set tenant context for this request
    this.tenantContext.setTenant(tenant.id, tenant.tenantSchema);
    next();
  }

  private extractTenantIdentifier(req: Request): string | null {
    const headerTenant = req.get('X-Tenant-ID') as string;
    return headerTenant;
  }
}
