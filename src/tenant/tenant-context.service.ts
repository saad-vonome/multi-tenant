// tenant-context.service.ts
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      schemaName?: string;
    }
  }
}

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  setTenant(tenantId: string, schemaName: string): void {
    // Store in the request object itself
    this.request.tenantId = tenantId;
    this.request.schemaName = schemaName;
  }

  getTenantId(): string {
    if (!this.request.tenantId) {
      throw new Error('Tenant context not set');
    }
    return this.request.tenantId;
  }

  getSchemaName(): string {
    if (!this.request.schemaName) {
      throw new Error('Schema name not set in tenant context');
    }
    return this.request.schemaName;
  }

  isSet(): boolean {
    return !!this.request.tenantId && !!this.request.schemaName;
  }

  clear(): void {
    this.request.tenantId = undefined;
    this.request.schemaName = undefined;
  }
}
