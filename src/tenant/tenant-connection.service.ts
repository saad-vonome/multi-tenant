//tenant-connection.service.ts

import { Injectable, Scope } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TenantContextService } from './tenant-context.service';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

@Injectable({ scope: Scope.REQUEST })
export class TenantConnectionService {
  private entityManager: EntityManager;

  constructor(
    private dataSource: DataSource,
    private readonly tenantContext: TenantContextService,
  ) {}

  async getConnection(): Promise<EntityManager> {
    if (this.entityManager) {
      return this.entityManager;
    }

    const tenantSchema = this.tenantContext.getSchemaName();
    if (!tenantSchema) {
      throw new Error('Tenant schema not found in request');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`SET search_path TO "${tenantSchema}"`);

    this.entityManager = queryRunner.manager;
    return this.entityManager;
  }

  async executeInTenantContext<T>(
    callback: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const manager = await this.getConnection();
    return callback(manager);
  }
}
