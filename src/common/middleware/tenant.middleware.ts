import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CoreService } from '../../core/services/core.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private coreService: CoreService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant identifier from subdomain or header
    const tenantIdentifier = this.extractTenantIdentifier(req);

    if (!tenantIdentifier) {
      throw new UnauthorizedException('Tenant identifier not provided');
    }
    // Skip tenant validation for registration/listing endpoints
    const url = req.originalUrl || req.url || req.path;
    if (
      url.endsWith('/tenants') ||
      url === '/tenants' ||
      url.endsWith('/tenants')
    ) {
      return next();
    }
    try {
      // Get tenant from core schema
      const tenant = await this.getTenant(tenantIdentifier, req);

      // Attach tenant schema to request
      req['tenantSchema'] = tenant.tenantSchema;
      req['tenantId'] = tenant.id;
      req['tenant'] = tenant;

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid tenant');
    }
  }

  private extractTenantIdentifier(req: Request): string | null {
    // Method 1: From custom header
    const headerTenant = req.headers['x-tenant-id'] as string;
    if (headerTenant) return headerTenant;

    // Method 2: From subdomain
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      return subdomain;
    }

    // Method 3: From query parameter (for development)
    const queryTenant = req.query.tenant as string;
    if (queryTenant) return queryTenant;

    return null;
  }

  private async getTenant(identifier: string, req: Request) {
    // Try to get by subdomain first
    if (req.headers.host?.startsWith(identifier)) {
      return this.coreService.getTenantBySubdomain(identifier);
    }

    // Otherwise, treat as schema name
    return this.coreService.getTenantBySchema(identifier);
  }
}
