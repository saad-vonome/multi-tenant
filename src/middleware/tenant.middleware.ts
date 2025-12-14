//tenant.middleware.ts

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CoreService } from 'src/core/core.service';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly coreService: CoreService,
    private readonly dataSource: DataSource,
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

    // Set the schema for this request
    await this.setSchemaForRequest(tenant.tenantSchema);

    // Store tenant info in request for later use
    req['tenantSchema'] = tenant.tenantSchema;

    next();
  }

  private extractTenantIdentifier(req: Request): string | null {
    const headerTenant = req.get('X-Tenant-ID') as string;
    return headerTenant;
  }

  private async setSchemaForRequest(schemaName: string) {
    if (!schemaName) {
      throw new Error('Tenant schema not found in request');
    }

    // Set search_path on the main connection pool
    await this.dataSource.query(`SET search_path TO "${schemaName}"`);
  }
}
