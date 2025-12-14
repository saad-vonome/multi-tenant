//tenant.middleware.ts

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly coreService: CoreService,
    private readonly prisma: PrismaService,
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
    await this.setSchemaForRequest(tenant.schemaName);

    // Store tenant info in request for later use
    req['tenantSchema'] = tenant.schemaName;

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

    // Set search_path on the Prisma connection
    await this.prisma.$executeRawUnsafe(`SET search_path TO "${schemaName}"`);
  }
}
