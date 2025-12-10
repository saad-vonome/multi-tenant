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
    return this.tenantId;
  }

  getSchemaName(): string {
    return this.schemaName;
  }

  hasTenant(): boolean {
    return !!this.tenantId && !!this.schemaName;
  }
}
