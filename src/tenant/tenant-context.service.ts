// tenant-context.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string;
  private schemaName: string;

  setTenant(tenantId: string, schemaName: string): void {
    this.tenantId = tenantId;
    this.schemaName = schemaName;
  }

  getTenantId(): string {
    if (!this.tenantId) {
      throw new Error('Tenant context not set');
    }
    return this.tenantId;
  }

  getSchemaName(): string {
    if (!this.schemaName) {
      throw new Error('Schema name not set in tenant context');
    }
    return this.schemaName;
  }

  isSet(): boolean {
    return !!this.tenantId && !!this.schemaName;
  }
}
